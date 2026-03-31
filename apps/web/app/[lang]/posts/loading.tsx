export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-surface">
      {/* Top bar skeleton */}
      <header className="sticky top-0 z-40 bg-surface border-b border-muted-200">
        <div
          className="mx-auto px-4 h-14 flex items-center justify-between"
          style={{ maxWidth: "var(--max-w-wide)" }}
        >
          <div className="h-4 w-24 bg-muted-200 rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted-200 rounded-sm animate-pulse" />
        </div>
      </header>

      <main
        className="mx-auto px-4 py-8"
        style={{ maxWidth: "var(--max-w-wide)" }}
      >
        {/* Filter bar skeleton */}
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-9 w-10 bg-muted-200 rounded-sm animate-pulse"
            />
          ))}
        </div>

        {/* Post card skeletons */}
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="py-6 border-b border-muted-200">
            <div className="h-3 w-24 bg-muted-200 rounded animate-pulse mb-3" />
            <div className="h-5 w-3/4 bg-muted-200 rounded animate-pulse mb-2" />
            <div className="h-4 w-full bg-muted-200 rounded animate-pulse mb-1" />
            <div className="h-4 w-2/3 bg-muted-200 rounded animate-pulse" />
          </div>
        ))}
      </main>
    </div>
  );
}
