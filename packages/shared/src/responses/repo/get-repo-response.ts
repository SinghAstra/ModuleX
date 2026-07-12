import { z } from "zod";
import { moduleSummaryDataSchema, repositoryDataSchema } from "../../schemas";

export const getRepositoryResponseSchema = repositoryDataSchema.extend({
  latestJobId: z.string().uuid().nullable(),
  moduleSummaries: z.array(moduleSummaryDataSchema).optional(),
});

export type GetRepositoryResponse = z.infer<typeof getRepositoryResponseSchema>;
