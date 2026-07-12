export const QUEUE_NAMES = {
  REPOSITORY_INGESTION: "repository-ingestion-queue",
  FILE_SUMMARIZATION: "file-summarization-queue",
  README_GENERATION: "readme-generation-queue",
} as const;

export const JOB_NAMES = {
  ANALYZE_REPO: "analyze-repo-job",
  SUMMARIZE_FILE: "summarize-file-job",
  GENERATE_README: "generate-readme-job",
} as const;
