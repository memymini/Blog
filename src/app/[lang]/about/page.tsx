import { cn } from "@/lib/utils";
import Image from "next/image";
import { getDictionary } from "../dictionaries";
export default async function AboutPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const dict = await getDictionary(lang);
  const { about } = dict;
  return (
    <div className="flex h-screen w-full flex-col lg:p-16 p-10 lg:gap-8 gap-4 overflow-y-auto">
      <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl text-center xl:text-start">
        {dict.role}
      </h2>
      <h1
        className={cn(
          "max-w-9xl lg:text-9xl text-[10vw] text-center xl:text-start",
          lang == "en" ? "font-anton" : "font-do-hyeon"
        )}
      >
        {dict.name}
      </h1>
      <div className="flex gap-8 2xl:gap-16 flex-col xl:flex-row xl:items-start items-center">
        <div className="relative w-full max-w-132 h-auto aspect-[4/5] rounded-lg">
          <Image
            src="/images/me.jpeg"
            alt="profile"
            fill
            className="object-cover rounded-lg"
          />
        </div>
        <div className="flex flex-col gap-8 xl:flex-1">
          <section id="intro">
            <h2 className="font-black text-2xl md:text-3xl text-center xl:text-start 2xl:text-4xl mb-2 ">
              {about.intro.title}
            </h2>
            <div className="flex flex-col gap-4 text-md 2xl:text-md max-w-200 text-justify">
              {about.intro.paragraphs.map((paragraph, idx) => (
                <p key={idx} dangerouslySetInnerHTML={{ __html: paragraph }} />
              ))}
            </div>
          </section>

          <div className="grid xl:grid-cols-2 gap-8">
            <section id="education">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2 ">
                {about.education.title}
              </h2>
              <ul className="flex flex-col gap-3">
                {about.education.items.map((item) => (
                  <li className="flex flex-col" key={item.institution}>
                    <span className="font-semibold text-xl">
                      {item.institution}
                    </span>
                    <div className="text-md md:text-md">{item.description}</div>
                  </li>
                ))}
              </ul>
            </section>

            <section id="tech stack">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2">
                {about.tech_title}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4 ">
                <Image
                  src="/icons/html5.svg"
                  alt="HTML"
                  width={30}
                  height={30}
                />
                <Image src="/icons/css.svg" alt="CSS" width={30} height={30} />
                <Image
                  src="/icons/javascript.svg"
                  alt="Javascript"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/typescript.svg"
                  alt="Typescript"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/nextjs.svg"
                  alt="Next.js"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/react.svg"
                  alt="React"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/tailwindcss.svg"
                  alt="Tailwind CSS"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/zustand.svg"
                  alt="Zustand"
                  width={30}
                  height={30}
                />
              </div>
            </section>

            <section id="collaboration tools">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2">
                {about.collaboration_title}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <Image
                  src="/icons/figma.svg"
                  alt="Figma"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/github.png"
                  alt="Github"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/notion.svg"
                  alt="Notion"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/discord.svg"
                  alt="Discord"
                  width={30}
                  height={30}
                />
              </div>
            </section>

            <section id="ai tools">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2">
                {about.ai_title}
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <Image
                  src="/icons/chatGPT.svg"
                  alt="ChatGPT"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/gemini.svg"
                  alt="Gemini"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/claude.svg"
                  alt="Claude"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/perplexity.svg"
                  alt="Perplexity"
                  width={30}
                  height={30}
                />
              </div>
            </section>
          </div>

          <section id="tmi">
            <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2 ">
              {about.likes.title}
            </h2>
            <p className="text-lg 2xl:text-lg">
              {about.likes.items.join(", ")}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
