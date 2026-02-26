interface LoadingDotsProps {
  text?: string;
}

function LoadingDots({ text = "Processing..." }: LoadingDotsProps) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 text-muted-foreground/70">
      <div className="flex gap-1">
        <div className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse" />
        <div
          className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse"
          style={{ animationDelay: "600ms" }}
        />
        <div
          className="w-1.5 h-1.5 bg-primary/70 rounded-full animate-pulse"
          style={{ animationDelay: "1200ms" }}
        />
      </div>
      {text && <span className="text-xs">{text}</span>}
    </div>
  );
}

export default LoadingDots;
