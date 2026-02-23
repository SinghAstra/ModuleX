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

export async function getRepoWithMetadata(id: string) {
  const repo = await prisma.repository.findUnique({
    where: { id },
    include: {
      logs: { orderBy: { createdAt: "desc" }, take: 50 },
      _count: { select: { files: true, directories: true } },
    },
  });

  if (!repo) return null;

  const [totalDeps, resolvedDeps] = await Promise.all([
    prisma.dependency.count({ where: { file: { repositoryId: id } } }),
    prisma.dependency.count({
      where: { file: { repositoryId: id }, resolvedFileId: { not: null } },
    }),
  ]);

  return {
    repo,
    audit: {
      total: totalDeps,
      resolved: resolvedDeps,
      score: totalDeps > 0 ? (resolvedDeps / totalDeps) * 100 : 0,
    },
  };
}

export type FullRepoMetadata = NonNullable<
  Prisma.PromiseReturnType<typeof getRepoWithMetadata>
>;

export interface TreeNode {
  id: string;
  name: string;
  type: "file" | "directory";
  path: string;
  children?: TreeNode[];
}

export async function getRepoTree(repositoryId: string): Promise<TreeNode[]> {
  const [directories, files] = await Promise.all([
    prisma.directory.findMany({ where: { repositoryId } }),
    prisma.file.findMany({
      where: { repositoryId },
      select: { id: true, name: true, path: true, directoryId: true },
    }),
  ]);

  const treeMap: Record<string, TreeNode> = {};
  const rootNodes: TreeNode[] = [];

  directories.forEach((dir) => {
    treeMap[dir.id] = {
      id: dir.id,
      name: dir.name,
      type: "directory",
      path: dir.path,
      children: [],
    };
  });

  directories.forEach((dir) => {
    if (dir.parentId && treeMap[dir.parentId]) {
      // For every treeMap[dir.parentId] children is empty array as how come Object is possibly 'undefined'.ts(2532)
      // (property) parentId: string

      treeMap[dir.parentId].children.push(treeMap[dir.id]);
    } else {
      rootNodes.push(treeMap[dir.id]);
    }
  });

  files.forEach((file) => {
    const fileNode: TreeNode = {
      id: file.id,
      name: file.name,
      type: "file",
      path: file.path,
    };

    if (file.directoryId && treeMap[file.directoryId]) {
      treeMap[file.directoryId].children?.push(fileNode);
    } else {
      rootNodes.push(fileNode);
    }
  });

  const sortNodes = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      if (a.type !== b.type) return a.type === "directory" ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
    nodes.forEach((node) => node.children && sortNodes(node.children));
  };

  sortNodes(rootNodes);
  return rootNodes;
}

export async function getFileDetails(fileId: string) {
  return await prisma.file.findUnique({
    where: { id: fileId },
    include: {
      symbols: true,
      dependencies: {
        include: {
          resolvedFile: {
            select: { path: true },
          },
        },
      },
    },
  });
}
