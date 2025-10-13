import Image from "next/image";
import Link from "next/link";
export function ProjectCard({
  href,
  image,
  alt,
  project,
}: {
  href: string;
  image: string;
  alt: string;
  project: { title: string; tagline: string; tech: string[] };
}) {
  return (
    <Link
      href={href}
      className="relative h-full rounded-xl flex items-center justify-center flex-col w-full min-w-full sm:min-w-100 max-h-150 p-10 overflow-hidden"
    >
      <Image
        src={image}
        alt={alt}
        fill
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/70 hover:bg-black/80 p-10">
        <div className="relative z-10 text-white flex flex-col h-full justify-between items-start">
          <div>
            <h2 className="text-5xl lg:text-6xl font-bold">{project.title}</h2>
            <p className="text-2xl font-medium">{project.tagline}</p>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {project.tech.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded-full bg-white/20 border border-[var(--glass-border)]"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
}
