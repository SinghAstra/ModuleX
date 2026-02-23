"use client";
import { TreeNode } from "@/services/repo-service";
import FileTreeSkeleton from "./file-tree-skeleton";
import TreeItem from "./tree-item";

interface FileTreeProps {
  nodes: TreeNode[];
  onFileSelect: (fileId: string) => void;
  selectedFileId?: string;
  isLoading: boolean;
}

const FileTree = ({
  nodes,
  onFileSelect,
  selectedFileId,
  isLoading,
}: FileTreeProps) => {
  if (isLoading) {
    return <FileTreeSkeleton />;
  }
  return (
    <div className="flex flex-col gap-1">
      {nodes.map((node) => (
        <TreeItem
          key={node.id}
          node={node}
          onFileSelect={onFileSelect}
          selectedFileId={selectedFileId}
        />
      ))}
    </div>
  );
};

export default FileTree;
