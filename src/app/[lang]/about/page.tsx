import Image from "next/image";
export default function AboutPage() {
  return (
    <div className="flex h-screen w-full flex-col lg:p-16 p-10 lg:gap-8 gap-4 overflow-y-auto">
      <h1 className="font-anton max-w-9xl lg:text-9xl text-[10vw] text-center xl:text-start">
        ABOUT
      </h1>
      <div className="flex gap-8 2xl:gap-16 flex-col xl:flex-row items-center">
        <div className="relative w-full max-w-150 h-auto aspect-[4/5]">
          <Image
            src="/images/me.jpeg"
            alt="profile"
            fill
            className="object-cover"
          />
        </div>
        <div className="flex flex-col gap-8 xl:flex-1">
          <section id="about-header" className="flex flex-col">
            <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl text-center xl:text-start">
              Web Developer
            </h2>
            <h2 className="font-bold text-4xl md:text-5xl 2xl:text-6xl text-center xl:text-start">
              MINHEE JUNG
            </h2>
          </section>
          <section id="intro">
            <h2 className="font-bold text-2xl xl:text-2xl mb-2 ">
              불가능을 가능하게 만드는, 도전을 즐기는 개발자입니다!
            </h2>
            <ul className="flex flex-col gap-3 text-md 2xl:text-md">
              <li>
                • 상황에 맞게 <strong>AI를 활용</strong>하여 문제를 효율적으로
                해결합니다.
              </li>
              <li>
                • <strong>예외처리와 테스트</strong>에 진심입니다.
              </li>
              <li>
                • 협업을 할 때에 <strong>구조와 컨벤션을 지키는 것</strong>을
                중요하게 생각합니다.
              </li>
              <li>
                • 새로운 환경에서도 <strong>빠르게 적응</strong>합니다.
              </li>
            </ul>
          </section>

          <div className="grid xl:grid-cols-2 gap-8">
            <section id="education">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2 ">
                Education
              </h2>
              <ul className="flex flex-col gap-3">
                <li className="flex flex-col">
                  <span className="font-semibold text-xl">동국대학교</span>
                  <div className="text-gray-600 text-md md:text-md">
                    컴퓨터공학전공 · 2022.03 - 2026.02 (졸업예정)
                  </div>
                </li>
                <li className="flex flex-col">
                  <span className="font-semibold text-xl">코드잇</span>
                  <div className="text-gray-600 text-md md:text-md">
                    프론트엔드 부트캠프 단기심화 수료 · 2025.07 - 2025.08
                  </div>
                </li>
              </ul>
            </section>

            <section id="tech stack">
              <h2 className="font-bold text-2xl md:text-3xl 2xl:text-4xl mb-2">
                Tech Stack
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
                  src="/icons/nextdotjs.svg"
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
                Collaboration Tools
              </h2>
              <div className="flex flex-wrap gap-4 mt-4">
                <Image
                  src="/icons/figma.svg"
                  alt="Figma"
                  width={30}
                  height={30}
                />
                <Image
                  src="/icons/github.svg"
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
                AI Tools
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
              Things what I like...
            </h2>
            <p className="text-lg 2xl:text-lg font-semibold">
              고양이🐱, 요리🍳, 운동💪, 여행✈️, 자전거🚲
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
