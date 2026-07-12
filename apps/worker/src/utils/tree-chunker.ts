export interface FileNode {
  id: string;
  path: string;
  summary: string;
  tokens: number;
}

export interface Bucket {
  path: string;
  tokenCount: number;
  files: FileNode[];
}

export interface TreeNode {
  id?: string;
  name: string;
  path: string;
  type: "file" | "dir";
  tokens: number;
  summary?: string;
  children: Map<string, TreeNode>;
}

export function buildVirtualTree(files: FileNode[]): TreeNode {
  const rootNode: TreeNode = {
    name: "root",
    path: "",
    type: "dir",
    tokens: 0,
    children: new Map<string, TreeNode>(),
  };

  for (const file of files) {
    const pathSegments = file.path.split("/");
    let currentNode = rootNode;

    for (let i = 0; i < pathSegments.length; i++) {
      const segment = pathSegments[i];
      const isFile = i === pathSegments.length - 1;

      if (!currentNode.children.has(segment)) {
        currentNode.children.set(segment, {
          name: segment,
          path: pathSegments.slice(0, i + 1).join("/"),
          type: isFile ? "file" : "dir",
          tokens: isFile ? file.tokens : 0,
          summary: isFile ? file.summary : undefined,
          children: new Map<string, TreeNode>(),
          id: isFile ? file.id : undefined,
        });
      }

      currentNode = currentNode.children.get(segment)!;
    }
  }

  return rootNode;
}

interface TraverseResult {
  unBucketedFiles: FileNode[];
  unBucketedTokens: number;
}

export interface ChunkOptions {
  minTokens: number;
  maxTokens: number;
}

export function chunkTreeIntoBuckets(
  files: FileNode[],
  options: ChunkOptions
): Bucket[] {
  const rootNode = buildVirtualTree(files);
  const finalBuckets: Bucket[] = [];

  function traverse(node: TreeNode): TraverseResult {
    if (node.type === "file") {
      return {
        unBucketedFiles: [
          {
            id: node.id!,
            path: node.path,
            summary: node.summary!,
            tokens: node.tokens,
          },
        ],
        unBucketedTokens: node.tokens,
      };
    }

    const unBucketedFiles: FileNode[] = [];
    let unBucketedTokens = 0;

    for (const childNode of node.children.values()) {
      const result = traverse(childNode);
      unBucketedFiles.push(...result.unBucketedFiles);
      unBucketedTokens += result.unBucketedTokens;
    }

    if (unBucketedTokens < options.minTokens) {
      return { unBucketedFiles, unBucketedTokens };
    } else if (
      unBucketedTokens >= options.minTokens &&
      unBucketedTokens <= options.maxTokens
    ) {
      const displayPath = node.path === "" ? "Root Directory" : node.path;

      finalBuckets.push({
        path: displayPath,
        tokenCount: unBucketedTokens,
        files: unBucketedFiles,
      });
      return {
        unBucketedFiles: [],
        unBucketedTokens: 0,
      };
    } else {
      let currentChunkFiles: FileNode[] = [];
      let currentChunkTokens = 0;
      let partNumber = 1;

      for (let file of unBucketedFiles) {
        if (currentChunkTokens + file.tokens > options.maxTokens) {
          const displayPath = node.path === "" ? "Root Directory" : node.path;

          finalBuckets.push({
            path: `${displayPath} (Part ${partNumber})`,
            tokenCount: currentChunkTokens,
            files: currentChunkFiles,
          });

          currentChunkFiles = [];
          currentChunkTokens = 0;
          partNumber++;
        }
        currentChunkFiles.push(file);
        currentChunkTokens = currentChunkTokens + file.tokens;
      }
      return {
        unBucketedFiles: currentChunkFiles,
        unBucketedTokens: currentChunkTokens,
      };
    }
  }

  const finalResult = traverse(rootNode);

  if (finalResult.unBucketedFiles.length > 0) {
    finalBuckets.push({
      path: "Root Directory (Final)",
      tokenCount: finalResult.unBucketedTokens,
      files: finalResult.unBucketedFiles,
    });
  }

  return finalBuckets;
}
