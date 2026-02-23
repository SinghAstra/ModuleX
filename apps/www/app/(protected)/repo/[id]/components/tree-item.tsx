import { cn } from "@/lib/utils";
import { TreeNode } from "@/services/repo-service";
import {
  ChevronDown,
  ChevronRight,
  FileCode,
  Folder,
  FolderOpen,
} from "lucide-react";
import { useState } from "react";
import FileTree from "./file-tree";

interface TreeItemProps {
  node: TreeNode;
  onFileSelect: any;
  selectedFileId?: string;
}

const TreeItem = ({ node, onFileSelect, selectedFileId }: TreeItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isDirectory = node.type === "directory";
  const isSelected = selectedFileId === node.id;

  if (isDirectory) {
    return (
      <div>
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 px-2 py-1 hover:bg-muted/50 rounded-sm cursor-pointer group transition-all duration-300"
        >
          <span className="text-muted-foreground group-hover:text-foreground">
            {isOpen ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </span>
          {isOpen ? (
            <FolderOpen className="w-4 h-4 text-amber-400 fill-amber-400/20" />
          ) : (
            <Folder className="w-4 h-4 text-amber-400/80" />
          )}
          <span className="text-sm font-medium truncate">{node.name}</span>
        </div>

        {isOpen && node.children && (
          <div className="ml-2 border-l border-border/50 mt-1">
            <FileTree
              nodes={node.children}
              onFileSelect={onFileSelect}
              selectedFileId={selectedFileId}
              isLoading={false}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div
      onClick={() => onFileSelect(node.id)}
      className={cn(
        "flex items-center gap-2 px-2 py-1 border-l-2 border-transparent rounded-sm cursor-pointer transition-all duration-300",
        isSelected
          ? "bg-muted/50 text-primary border-primary"
          : "hover:bg-muted/50 text-muted-foreground hover:text-foreground"
      )}
    >
      <FileCode
        className={cn(
          "w-4 h-4 shrink-0",
          isSelected ? "text-primary" : "text-blue-400/70"
        )}
      />
      <span className="text-sm truncate">{node.name}</span>
    </div>
  );
};

export default TreeItem;
