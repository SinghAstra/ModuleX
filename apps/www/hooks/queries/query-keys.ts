export const repoKeys = {
  all: ["repositories"] as const,
  lists: () => [...repoKeys.all, "list"] as const,
  list: (filters: string) => [...repoKeys.lists(), { filters }] as const,
  details: () => [...repoKeys.all, "detail"] as const,
  detail: (id: string) => [...repoKeys.details(), id] as const,
};
