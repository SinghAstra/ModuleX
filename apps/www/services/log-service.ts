import { logError } from "@/lib/log-error";
import { prisma } from "@understand-x/database";

export async function getRepoLogs(repoId: string) {
  try {
    const logs = await prisma.log.findMany({
      where: { repositoryId: repoId },
      orderBy: { createdAt: "desc" },
    });
    return logs;
  } catch (error) {
    logError(error);
    return [];
  }
}
