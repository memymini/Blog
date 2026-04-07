export default function PostLoading() {
  return (
    <div className="min-h-screen bg-warm-50 flex justify-center px-4 py-4">
      <div className="w-full max-w-5xl flex gap-4 items-start">
        {/* Profile sidebar skeleton */}
        <div className="hidden md:block w-52 shrink-0">
          <div className="bg-surface p-5 shadow-sm">
            <div className="w-28 h-28 bg-muted-200 rounded-lg animate-pulse mb-4" />
            <div className="h-5 w-20 bg-muted-200 rounded animate-pulse mb-3" />
            <div className="space-y-1.5 mb-3">
              <div className="h-3 w-32 bg-muted-200 rounded animate-pulse" />
              <div className="h-3 w-36 bg-muted-200 rounded animate-pulse" />
            </div>
            <div className="h-3 w-28 bg-muted-200 rounded animate-pulse" />
          </div>
        </div>

        {/* Post content skeleton */}
        <div className="flex-1 min-w-0 bg-surface shadow-sm overflow-hidden">
          {/* Top bar skeleton */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-muted-200">
            <div className="h-5 w-5 bg-muted-200 rounded animate-pulse" />
            <div className="h-9 w-9 bg-muted-200 rounded-sm animate-pulse" />
          </div>

          {/* Cover image placeholder */}
          <div className="relative aspect-[16/9] bg-muted-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6 space-y-2">
              <div className="h-3 w-20 bg-white/30 rounded animate-pulse" />
              <div className="h-7 w-64 bg-white/30 rounded animate-pulse" />
              <div className="h-7 w-44 bg-white/30 rounded animate-pulse" />
            </div>
          </div>

          {/* Body paragraphs */}
          <div className="px-5 py-8 space-y-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="h-4 bg-muted-200 rounded animate-pulse"
                style={{ width: `${80 + (i % 3) * 7}%` }}
              />
            ))}
            <div className="h-4 w-2/5 bg-muted-200 rounded animate-pulse" />

            <div className="h-6" />

            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i + 10}
                className="h-4 bg-muted-200 rounded animate-pulse"
                style={{ width: `${70 + (i % 4) * 8}%` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
