import { prisma } from "@repo/db";
import {
  FILE_SUMMARY_STATUS,
  JOB_NAMES,
  JOB_STATUS,
  logError,
  REPOSITORY_STATUS,
} from "@repo/shared";
import { readmeGenerationQueue, trackProgress } from "@repo/shared/server";
import { MODEL_CONFIG } from "../ai/model-config";
import { executeAIRequest } from "../ai/request-manager";
import { SYSTEM_PROMPT } from "../prompt";
import { chunkTreeIntoBuckets, FileNode } from "../utils/tree-chunker";

export const readmeService = {
  async prepareBuckets(repositoryId: string) {
    const dbFiles = await prisma.repositoryFile.findMany({
      where: {
        repositoryId,
        summaryStatus: FILE_SUMMARY_STATUS.COMPLETED,
      },
      select: {
        relativePath: true,
        summary: true,
        id: true,
      },
    });

    const mappedFiles: FileNode[] = dbFiles.map((file) => {
      return {
        id: file.id,
        path: file.relativePath,
        summary: file.summary!,
        tokens: Math.ceil(file.summary ? file.summary.length / 4 : 0),
      };
    });

    const buckets = chunkTreeIntoBuckets(mappedFiles, {
      minTokens: MODEL_CONFIG.minInputTokens,
      maxTokens: MODEL_CONFIG.maxInputTokens,
    });

    return buckets;
  },

  async triggerReadmeGeneration(repositoryId: string, jobId: string) {
    await readmeGenerationQueue.add(JOB_NAMES.GENERATE_README, {
      repositoryId,
      jobId,
    });
  },

  async processReadmeGeneration(repositoryId: string, jobId: string) {
    try {
      await prisma.moduleSummary.deleteMany({
        where: { repositoryId: repositoryId },
      });

      const repo = await prisma.repository.findUnique({
        where: { id: repositoryId },
        select: { name: true },
      });

      const buckets = await readmeService.prepareBuckets(repositoryId);
      let runId = 0;

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.RUNNING,
        message: `Grouping your project files... (${buckets.length} folders found)`,
      });

      for (const bucket of buckets) {
        const fileData = bucket.files
          .map((f) => `File: ${f.path}\nSummary: ${f.summary}`)
          .join("\n\n");
        const userPayload = `Directory: ${bucket.path}\n\nFiles:\n${fileData}`;

        const aiResponse = await executeAIRequest(runId, {
          model: MODEL_CONFIG.activeModel,
          messages: [
            { role: "system", content: SYSTEM_PROMPT.MODULE_SUMMARY },
            {
              role: "user",
              content: userPayload,
            },
          ],
        });

        const moduleSummary =
          aiResponse?.choices[0]?.message?.content?.trim() ||
          "No Module summary written.";

        await prisma.moduleSummary.create({
          data: {
            summary: moduleSummary,
            path: bucket.path,
            repositoryId,
            files: {
              connect: bucket.files.map((f) => ({ id: f.id })),
            },
          },
        });
        runId++;

        await trackProgress({
          jobId,
          repositoryId,
          status: JOB_STATUS.RUNNING,
          message: `Reading folder: ${bucket.path} (${runId}/${buckets.length})`,
        });
      }

      const moduleSummaries = await prisma.moduleSummary.findMany({
        where: { repositoryId },
        orderBy: { path: "asc" },
      });

      const finalPayload = moduleSummaries
        .map((ms) => `### ${ms.path}\n${ms.summary}`)
        .join("\n\n");

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.RUNNING,
        message: "Putting it all together into your final README...",
      });

      const aiResponse = await executeAIRequest(runId, {
        model: MODEL_CONFIG.activeModel,
        messages: [
          { role: "system", content: SYSTEM_PROMPT.MASTER_README },
          {
            role: "user",
            content: `Project Name: ${
              repo?.name || "My Project"
            }\n\n${finalPayload}`,
          },
        ],
      });

      const finalReadmeText =
        aiResponse?.choices[0]?.message?.content?.trim() ||
        "Failed to generate README.";

      await prisma.repository.update({
        where: { id: repositoryId },
        data: {
          readme: finalReadmeText,
          status: REPOSITORY_STATUS.COMPLETED,
        },
      });

      await prisma.job.update({
        where: { id: jobId },
        data: {
          status: JOB_STATUS.COMPLETED,
          completedAt: new Date(),
        },
      });

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.COMPLETED,
        message: "All done! Your README is ready.",
      });
    } catch (error) {
      logError(error);

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.FAILED,
        message: "Oops! Something went wrong while writing the README.",
      });

      await prisma.job.update({
        where: { id: jobId },
        data: { status: JOB_STATUS.FAILED },
      });

      throw error;
    }
  },
};
