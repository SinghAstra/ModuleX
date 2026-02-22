"use server";

import { Prisma, prisma } from "@understand-x/database";



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
      treeMap[dir.parentId].children?.push(treeMap[dir.id]);
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
