import Link from "next/link";

export default function Nav() {
  return (
    <div className="flex flex-col w-12 h-screen justify-start items-center shadow-lg gap-5">
      <Link href="/">
        <p className="font-extrabold">
          mini
          <br />
          .log
        </p>
      </Link>
      <div className="flex items-center justify-center rounded-3xl bg-amber-400 w-9 h-9">
        <img src="/icons/image.svg" />
      </div>
      <div className="flex flex-col gap-5">
        <img src="/icons/page.svg" alt="page icon" className="size-6" />
        <Link href="/admin/new">
          <img src="/icons/write.svg" alt="write icon" className="size-6" />
        </Link>
      </div>
    </div>
  );
}
