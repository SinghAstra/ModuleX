export const QUEUE_NAMES = {
  REPOSITORY_INGESTION: "repository-ingestion-queue",
  FILE_SUMMARIZATION: "file-summarization-queue",
  MODULE_GENERATION: "module-generation-queue",
} as const;

export const JOB_NAMES = {
  ANALYZE_REPO: "analyze-repo-job",
  SUMMARIZE_FILE: "summarize-file-job",
  GENERATE_MODULES: "generate-modules-job",
} as const;
