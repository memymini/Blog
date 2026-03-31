import { H3, BodySm } from "@/components/ui/typography";

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export function EmptyState({
  title = "No posts found",
  description = "There are no posts here yet.",
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
      <GlobeIcon />
      <H3 className="text-secondary-400">{title}</H3>
      <BodySm className="text-secondary-400 max-w-xs">{description}</BodySm>
    </div>
  );
}

function GlobeIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.25"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-muted-300"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
      <path d="M2 12h20" />
    </svg>
  );
}
