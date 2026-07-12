import { type RepositoryTreeNode } from "@repo/shared";

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
