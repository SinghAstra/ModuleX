import { type RepositoryTreeNode } from "@repo/shared";

export function extractAllFolderPaths(nodes: RepositoryTreeNode[]): string[] {
  const paths: string[] = [];
  const traverse = (items: RepositoryTreeNode[]) => {
    for (const item of items) {
      if (item.type === "folder") {
        paths.push(item.relativePath);
        traverse(item.children);
      }
    }
  };
  traverse(nodes);
  return paths;
}

export function extractAllCompletedFilePaths(
  nodes: RepositoryTreeNode[]
): string[] {
  const paths: string[] = [];
  const traverse = (items: RepositoryTreeNode[]) => {
    for (const item of items) {
      if (item.type === "file" && item.summaryStatus === "COMPLETED") {
        paths.push(item.relativePath);
      } else if (item.type === "folder") {
        traverse(item.children);
      }
    }
  };
  traverse(nodes);
  return paths;
}

export function compileProjectSummaryText(nodes: RepositoryTreeNode[]): string {
  const sections: string[] = [];
  const traverse = (items: RepositoryTreeNode[]) => {
    for (const item of items) {
      if (
        item.type === "file" &&
        item.summaryStatus === "COMPLETED" &&
        item.summary
      ) {
        sections.push(`${item.relativePath}\n\n${item.summary}`);
      } else if (item.type === "folder") {
        traverse(item.children);
      }
    }
  };
  traverse(nodes);
  return sections.join(
    "\n\n------------------------------------------------\n\n"
  );
}
