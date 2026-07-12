import { prisma } from "@repo/db";
import { logError, QUEUE_NAMES, ModuleGenerationJobData } from "@repo/shared";
import { redisConnection } from "@repo/shared/server";
import { Worker, type Job } from "bullmq";
import { moduleService } from "../services/module.service";

export const moduleGenerationWorker = new Worker<ModuleGenerationJobData>(
  QUEUE_NAMES.MODULE_GENERATION,
  async (job: Job<ModuleGenerationJobData>) => {
    const { jobId, repositoryId } = job.data;
    await moduleService.processModuleGeneration(repositoryId, jobId);
  },
  {
    connection: redisConnection,
    concurrency: 4,
  }
);

moduleGenerationWorker.on("failed", (job, error) => {
  logError(error);
});

moduleGenerationWorker.on("ready", () =>
  console.log("moduleGenerationWorker ready")
);
moduleGenerationWorker.on("active", (job) =>
  console.log("moduleGenerationWorker active", job?.id)
);
moduleGenerationWorker.on("error", (err) => {
  console.log("moduleGenerationWorker error");
  logError(err);
});