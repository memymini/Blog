export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-warm-50 flex justify-center px-4 py-4">
      <div className="w-full max-w-5xl flex gap-4 items-start">
        {/* Profile sidebar skeleton */}
        <div className="hidden md:block w-52 shrink-0">
          <div className="bg-surface p-5 shadow-sm">
            <div className="w-28 h-28 bg-muted-200 rounded-lg animate-pulse mb-4" />
            <div className="h-5 w-20 bg-muted-200 rounded animate-pulse mb-3" />
            <div className="space-y-1.5 mb-3">
              <div className="h-3 w-16 bg-muted-200 rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted-200 rounded animate-pulse" />
              <div className="h-3 w-36 bg-muted-200 rounded animate-pulse" />
            </div>
            <div className="h-3 w-28 bg-muted-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Main content skeleton */}
        <div className="flex-1 min-w-0 bg-surface shadow-sm overflow-hidden">
          {/* Top bar skeleton */}
          <div className="flex items-center gap-3 px-5 py-4 border-b border-muted-200">
            <div className="flex items-center gap-2 flex-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div
                  key={i}
                  className="flex-none h-8 w-8 bg-muted-200 rounded-full animate-pulse"
                />
              ))}
            </div>
            <div className="flex-none h-8 w-8 bg-muted-200 rounded-full animate-pulse" />
          </div>

          {/* Post item skeletons */}
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="border-b border-muted-100 last:border-b-0 px-8 py-7">
                <div className="h-3 w-28 bg-muted-200 rounded animate-pulse mb-3" />
                <div
                  className="h-5 bg-muted-200 rounded animate-pulse"
                  style={{ width: `${55 + (i % 4) * 12}%` }}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
