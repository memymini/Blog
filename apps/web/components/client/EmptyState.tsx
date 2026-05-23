import { H3, BodySm } from "@/components/ui/typography";
import { GlobeIcon } from "@/components/icons";

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
      <GlobeIcon size={40} strokeWidth={1.25} className="text-muted-300" />
      <H3 className="text-secondary-400">{title}</H3>
      <BodySm className="text-secondary-400 max-w-xs">{description}</BodySm>
    </div>
  );
}
