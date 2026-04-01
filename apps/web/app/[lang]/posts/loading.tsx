export default function PostsLoading() {
  return (
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="bg-surface min-h-screen max-w-200 w-full">
        {/* Top bar skeleton */}
        <div className="flex items-center gap-3 px-5 py-3 border-b border-muted-200">
          {/* Filter buttons */}
          <div className="flex items-center gap-2 flex-1">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className="flex-none h-9 w-10 bg-muted-200 rounded-sm animate-pulse"
              />
            ))}
          </div>
          {/* Lang toggle */}
          <div className="flex-none h-9 w-9 bg-muted-200 rounded-sm animate-pulse" />
        </div>

        {/* Post item skeletons */}
        <div className="pt-4">
          <ul>
            {Array.from({ length: 8 }).map((_, i) => (
              <li key={i} className="border-b border-muted-100 last:border-b-0 px-8 py-7">
                {/* Date + flag */}
                <div className="h-3 w-28 bg-muted-200 rounded animate-pulse mb-3" />
                {/* Title — matches text-h4 height */}
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
