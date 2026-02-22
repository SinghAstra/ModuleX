"use server";

import { authOptions } from "@/lib/auth-options";
import { Prisma, prisma } from "@understand-x/database";
import { getServerSession } from "next-auth";

export async function getSidebarRepos() {
  const session = await getServerSession(authOptions);

  return await prisma.repository.findMany({
    where: { userId: session?.user.id },
    select: { id: true, name: true, status: true, avatarUrl: true },
    orderBy: { createdAt: "desc" },
  });
}

export type SidebarRepo = Prisma.PromiseReturnType<
  typeof getSidebarRepos
>[number];
