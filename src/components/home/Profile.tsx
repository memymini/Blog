import Image from "next/image";
export default function Profile() {
  return (
    <div className="relative w-135 h-135">
      <div
        className="absolute inset-0 rounded-full bg-gradient-to-b from-[#424242] to-[#555555] blur-lg"
        aria-hidden
      />
      <div className="relative flex items-center justify-center w-135 h-135 rounded-full">
        <div className="relative w-125 h-125 rounded-full overflow-hidden">
          <Image
            src="/images/profile.jpg"
            alt="profile-image"
            fill
            style={{ objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  );
}
