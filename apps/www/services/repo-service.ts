"use server";

import { prisma } from "@understand-x/database";

export async function getSidebarRepos(userId: string) {
  return await prisma.repository.findMany({
    where: { userId },
    select: { id: true, name: true, status: true, avatarUrl: true },
    orderBy: { createdAt: "desc" },
  });
}
