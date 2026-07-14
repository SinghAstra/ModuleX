import { prisma } from "@repo/db";
import {
  FILE_SUMMARY_STATUS,
  JOB_NAMES,
  JOB_STATUS,
  logError,
  REPOSITORY_STATUS,
} from "@repo/shared";
import { moduleGenerationQueue, trackProgress } from "@repo/shared/server";
import { MODEL_CONFIG } from "../ai/model-config";
import { executeAIRequest } from "../ai/request-manager";
import { SYSTEM_PROMPT } from "../prompt";
import { chunkTreeIntoBuckets, FileNode } from "../utils/tree-chunker";

export const moduleService = {
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

    return chunkTreeIntoBuckets(mappedFiles, {
      minTokens: MODEL_CONFIG.minInputTokens,
      maxTokens: MODEL_CONFIG.maxInputTokens,
    });
  },

  async triggerModuleGeneration(repositoryId: string, jobId: string) {
    await moduleGenerationQueue.add(JOB_NAMES.GENERATE_MODULES, {
      repositoryId,
      jobId,
    });
  },

  async processModuleGeneration(repositoryId: string, jobId: string) {
    try {
      await prisma.moduleSummary.deleteMany({
        where: { repositoryId: repositoryId },
      });

      const buckets = await moduleService.prepareBuckets(repositoryId);
      let runId = 0;

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.RUNNING,
        message: "Grouping project files...",
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

        const existingSummary = await prisma.moduleSummary.findFirst({
          where: {
            repositoryId: repositoryId,
            path: bucket.path,
          },
        });

        if (existingSummary) {
          await prisma.moduleSummary.update({
            where: { id: existingSummary.id },
            data: {
              summary: `${existingSummary.summary}\n\n---\n\n${moduleSummary}`,
              files: {
                connect: bucket.files.map((f) => ({ id: f.id })),
              },
            },
          });
        } else {
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
        }

        runId++;

        await trackProgress({
          jobId,
          repositoryId,
          status: JOB_STATUS.RUNNING,
          message: `Analyzing folder: ${bucket.path} (${runId}/${buckets.length})`,
        });
      }

      await prisma.repository.update({
        where: { id: repositoryId },
        data: {
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
        message: "Analysis complete! Loading workspace...",
      });
    } catch (error) {
      logError(error);

      await trackProgress({
        jobId,
        repositoryId,
        status: JOB_STATUS.FAILED,
        message: "Process failed. Please try again.",
      });

      await prisma.job.update({
        where: { id: jobId },
        data: { status: JOB_STATUS.FAILED },
      });

      throw error;
    }
  },
};
