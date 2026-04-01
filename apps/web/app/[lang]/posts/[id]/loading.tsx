export default function PostLoading() {
  return (
    <div className="min-h-screen bg-muted-100 flex justify-center">
      <div className="bg-surface min-h-screen max-w-200 w-full">
        {/* Top bar skeleton */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-muted-200">
          <div className="h-5 w-5 bg-muted-200 rounded animate-pulse" />
          <div className="h-9 w-9 bg-muted-200 rounded-sm animate-pulse" />
        </div>

        {/* Cover image with overlaid date + title */}
        <div className="relative aspect-[16/9] bg-muted-200 animate-pulse">
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
          {/* Date + title pinned to bottom-left */}
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
  );
}
