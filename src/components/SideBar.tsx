import Link from "next/link";
import Profile from "@/components/ui/Profile";

export default function SideBar() {
  return (
    <div className="flex flex-col w-12 h-screen justify-start items-center shadow-lg gap-5">
      <Link href="/">
        <p className="font-extrabold">
          mini
          <br />
          .log
        </p>
      </Link>
      <Profile />
      <div className="flex flex-col gap-5">
        <img src="/icons/page.svg" alt="page icon" className="size-6" />
        <Link href="/admin/new">
          <img src="/icons/write.svg" alt="write icon" className="size-6" />
        </Link>
      </div>
    </div>
  );
}
