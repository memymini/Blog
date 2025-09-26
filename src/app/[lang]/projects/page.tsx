import Image from "next/image";
import Link from "next/link";
import { getDictionary } from "../dictionaries";
export default async function ProjectsPage({
  params,
}: {
  params: { lang: string };
}) {
  const dict = await getDictionary(params.lang);
  const projects = dict.projects;

  return (
    <div className="flex h-screen w-full flex-col lg:p-16 p-10 lg:gap-8 gap-4">
      <h1 className="font-anton max-w-9xl lg:text-9xl text-[10vw]">PROJECTS</h1>
      <div className="flex w-full h-full gap-8 overflow-x-auto">
        {/* VeriBadge Card */}
        <Link
          href="/"
          className="relative h-full rounded-xl flex items-center justify-center flex-col w-full min-w-full sm:min-w-100 max-h-150 p-10 overflow-hidden"
        >
          {/* 배경 이미지 */}
          <Image
            src="/images/veribadge.png"
            alt="VeriBadge"
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/70 hover:bg-black/80 " />
          {/* 텍스트 */}
          <div className="relative z-10 text-white flex flex-col h-full justify-between items-start">
            <div>
              <h2 className="text-5xl lg:text-6xl font-bold">
                {projects[0].title}
              </h2>
              <p className="text-2xl font-medium">{projects[0].tagline}</p>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {projects[0].tech.map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2 py-1 rounded-full bg-white/20 border border-[var(--glass-border)]"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        </Link>
        {/* Modudo Card */}
        <div className="relative h-full rounded-xl flex items-center justify-center flex-col w-full min-w-full sm:min-w-100 max-h-150 overflow-hidden">
          {/* 배경 이미지 */}
          <Image
            src="/images/modudo.png"
            alt="Modudo"
            fill
            className="absolute inset-0 w-full h-full object-cover"
          />
          {/* 어두운 오버레이 */}
          <div className="absolute inset-0 bg-black/70 hover:bg-black/80" />
          {/* 텍스트 */}
          <div className="relative z-10 text-center text-white">
            <h2 className="text-5xl lg:text-6xl font-bold">Modudo</h2>
            <p className="text-2xl font-medium">팀 스터디 관리 서비스</p>
          </div>
        </div>
      </div>
    </div>
  );
}
