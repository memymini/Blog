import Image from "next/image";
import type { Lang } from "@repo/types";

const PROFILE = {
  name: { ko: "미니 | Travelog", en: "Minnie | Travelog" },
  email: "minhi0614@gmail.com",
  imageSrc: "/images/profile.jpg",
  location: "Korea 🇰🇷 / 📍Ghana 🇬🇭",
  interests: ["🧑‍💻", "🍎", "☕️", "🚴", "✈️", "🐱", "🐠", "🧁"],
};

interface ProfileCardProps {
  lang: Lang;
}

export function ProfileCard({ lang }: ProfileCardProps) {
  const name = PROFILE.name[lang];

  return (
    <aside className="w-full">
      <div className="bg-surface p-5 shadow-sm">
        <div className="relative w-28 h-28 mb-4">
          <Image
            src={PROFILE.imageSrc}
            alt={name}
            fill
            sizes="112px"
            className="object-cover"
            priority
          />
        </div>

        <h2 className="text-h4 font-bold text-primary-900 mb-2">{name}</h2>

        <div className="text-body-sm text-secondary-500 space-y-0.5 mb-3">
          <p>{PROFILE.location}</p>
          <p>{PROFILE.email}</p>
        </div>

        <div className="flex flex-wrap gap-1 text-body-base">
          {PROFILE.interests.map((emoji) => (
            <span key={emoji}>{emoji}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
