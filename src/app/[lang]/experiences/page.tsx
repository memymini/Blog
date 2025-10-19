"use cli";
import { TimelineItem } from "@/components/experiences/TimeLine";
import { getDictionary } from "../dictionaries";
import { cn } from "@/lib/utils";

export default async function ExperiencsPage({
  params,
}: {
  params: { lang: string };
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const projects = dict.experiences;
  return (
    <div className="flex h-screen w-full flex-col lg:p-16 p-10 lg:gap-8 gap-4 overflow-y-auto">
      <h1
        className={cn(
          "max-w-9xl lg:text-9xl text-[10vw] text-center xl:text-start",
          lang == "en" ? "font-black" : "font-black"
        )}
      >
        {dict.nav_experience}
      </h1>
      <div className="relative border-l border-gray-300 dark:border-gray-700 pl-8 mt-8 space-y-10">
        {projects.map((p, i) => (
          <TimelineItem
            key={i}
            year={p.period}
            title={p.role}
            org={p.org}
            description={p.bullets[0]}
            delay={0.2 * (i + 1)}
          />
        ))}
      </div>
    </div>
  );
}
