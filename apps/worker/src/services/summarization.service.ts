import { prisma } from "@repo/db";
import { FILE_SUMMARY_STATUS, JOB_STATUS, logError } from "@repo/shared";
import { trackProgress } from "@repo/shared/server";
import fs from "node:fs/promises";
import path from "node:path";
import { estimateTokenCount, MODEL_CONFIG } from "../ai/model-config.js";
import { executeAIRequest } from "../ai/request-manager.js";
import { SYSTEM_PROMPT } from "../prompt.js";
import { classifyFile } from "../utils/file-classifier.js";
import { getWorkspacePath } from "../utils/workspace.js";
import { moduleService } from "./module.service.js";

export const summarizationService = {
  async processFileSummary(
    fileId: string,
    repositoryId: string,
    jobId: string,
    runId: number
  ) {
    const file = await prisma.repositoryFile.findUnique({
      where: { id: fileId },
    });
    const repo = await prisma.repository.findUnique({
      where: { id: repositoryId },
    });

    if (!file || !repo) {
      throw new Error(
        `SUMMARIZATION_ERROR: Missing records for File: ${fileId} or Repo: ${repositoryId}`
      );
    }

    await prisma.repositoryFile.update({
      where: { id: fileId },
      data: { summaryStatus: FILE_SUMMARY_STATUS.PROCESSING },
    });

    const workspacePath = getWorkspacePath(repositoryId);

    try {
      const absoluteFilePath = path.join(workspacePath, file.relativePath);
      const fileContent = await fs.readFile(absoluteFilePath, "utf8");

      const classification = classifyFile(
        file.relativePath,
        path.basename(file.relativePath),
        fileContent
      );

      let summaryText = "";

      if (!classification.shouldSummarizeWithAI) {
        summaryText = classification.staticSummary;
        console.log(
          `[Run ${runId}] ⚡ FAST-TRACK | Bypassed AI overhead for ${classification.category} resource: ${file.relativePath}`
        );
      } else {
        const contentTokens = estimateTokenCount(fileContent);
        const promptTokens =
          estimateTokenCount(SYSTEM_PROMPT.FILE_SUMMARY) + 150;
        const totalEstimatedTokens = contentTokens + promptTokens;

        if (totalEstimatedTokens > MODEL_CONFIG.maxInputTokens) {
          summaryText = await generateChunkedSummary(
            runId,
            file.relativePath,
            fileContent
          );
        } else {
          summaryText = await generateSummaryDirectly(
            runId,
            file.relativePath,
            fileContent
          );
        }
      }

      await prisma.repositoryFile.update({
        where: { id: fileId },
        data: {
          summary: summaryText,
          summaryStatus: FILE_SUMMARY_STATUS.COMPLETED,
        },
      });

      await updateGlobalProgress(repositoryId, jobId, workspacePath);
    } catch (error: unknown) {
      await prisma.repositoryFile.update({
        where: { id: fileId },
        data: { summaryStatus: FILE_SUMMARY_STATUS.FAILED },
      });
      throw error;
    }
  },
};

async function generateSummaryDirectly(
  runId: number,
  relativePath: string,
  content: string
): Promise<string> {
  const aiResponse = await executeAIRequest(runId, {
    model: MODEL_CONFIG.activeModel,
    messages: [
      { role: "system", content: SYSTEM_PROMPT.FILE_SUMMARY },
      {
        role: "user",
        content: `Explain why this file exists and its primary responsibility:\n\nPath: ${relativePath}\n\nContent:\n${content}`,
      },
    ],
  });
  return (
    aiResponse?.choices[0]?.message?.content?.trim() || "No summary written."
  );
}

async function generateChunkedSummary(
  runId: number,
  relativePath: string,
  content: string
): Promise<string> {
  const targetChunkSize = Math.floor(MODEL_CONFIG.maxInputTokens * 3.2);
  const lines = content.split("\n");
  const chunks: string[] = [];
  let currentChunk = "";

  for (const line of lines) {
    if ((currentChunk + "\n" + line).length > targetChunkSize) {
      if (currentChunk) chunks.push(currentChunk);
      currentChunk = line;
    } else {
      currentChunk = currentChunk ? currentChunk + "\n" + line : line;
    }
  }
  if (currentChunk) chunks.push(currentChunk);

  const totalOriginalChunks = chunks.length;
  const isTruncated = totalOriginalChunks > 2;

  const chunksToProcess = isTruncated ? chunks.slice(0, 2) : chunks;

  console.log(
    `[Run ${runId}] 🧩 File: ${relativePath} split into ${totalOriginalChunks} chunks. Processing: ${chunksToProcess.length} (Truncated: ${isTruncated})`
  );

  const intermediateSummaries: string[] = [];
  for (let i = 0; i < chunksToProcess.length; i++) {
    const chunkResponse = await executeAIRequest(runId, {
      model: MODEL_CONFIG.activeModel,
      messages: [
        { role: "system", content: SYSTEM_PROMPT.FILE_SUMMARY },
        {
          role: "user",
          content: `Summary step (${i + 1}/${
            chunksToProcess.length
          }) for "${relativePath}":\n\nCode:\n${chunksToProcess[i]}`,
        },
      ],
    });
    const partialText = chunkResponse?.choices[0]?.message?.content?.trim();
    if (partialText) intermediateSummaries.push(partialText);
  }

  const unifiedPayload = intermediateSummaries
    .map((s, idx) => `Segment ${idx + 1} Summary: ${s}`)
    .join("\n\n");

  const reductionResponse = await executeAIRequest(runId, {
    model: MODEL_CONFIG.activeModel,
    messages: [
      { role: "system", content: SYSTEM_PROMPT.FILE_SUMMARY },
      {
        role: "user",
        content: `Synthesize these partial summaries into one cohesive overview explaining why "${relativePath}" exists and its overall responsibility:\n\n${unifiedPayload}`,
      },
    ],
  });

  let finalSummary =
    reductionResponse?.choices[0]?.message?.content?.trim() ||
    "Failed synthesizing fragmented summaries.";

  if (isTruncated) {
    finalSummary += ` Note: This summary was derived from the initial sections of this large file layout.`;
  }

  return finalSummary;
}

async function updateGlobalProgress(
  repositoryId: string,
  jobId: string,
  diskPath: string
) {
  const totalCount = await prisma.repositoryFile.count({
    where: { repositoryId },
  });
  const completedCount = await prisma.repositoryFile.count({
    where: { repositoryId, summaryStatus: FILE_SUMMARY_STATUS.COMPLETED },
  });

  await trackProgress({
    jobId,
    repositoryId,
    status: JOB_STATUS.RUNNING,
    message: `Analyzing files... (${completedCount}/${totalCount})`,
  });

  if (completedCount === totalCount) {
    await trackProgress({
      jobId,
      repositoryId,
      status: JOB_STATUS.RUNNING,
      message: "Summarization complete! Generating final README...",
    });

    await moduleService.triggerModuleGeneration(repositoryId, jobId);

    try {
      await fs.rm(diskPath, { recursive: true, force: true });
      console.log(
        `[CLEANUP] Successfully deleted repository from disk: ${diskPath}`
      );
    } catch (error) {
      logError(error);
      console.error(
        `[CLEANUP ERROR] Failed to delete directory ${diskPath}:`,
        error
      );
    }
  }
}
