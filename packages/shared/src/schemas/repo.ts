import { z } from "zod";

export const importRepoSchema = z.object({
  repoUrl: z.url("Please provide a valid repository URL"),
});

export type ImportRepoInput = z.infer<typeof importRepoSchema>;

export const REDIS_CHANNELS = {
  REPO_LOG_PUBLISH: "REPOS:LOG_STREAM",
} as const;

export const SOCKET_EVENTS = {
  LOG_UPDATED: "log_updated",
};

export const REPO_STATUS = {
  QUEUED: "QUEUED",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  FAILED: "FAILED",
} as const;

export type RepoStatus = keyof typeof REPO_STATUS;
