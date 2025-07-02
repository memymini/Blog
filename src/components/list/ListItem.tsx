"use client";
import { Content } from "@/type/content";
import { Category } from "@/components/list/Category";
import { formatToKST } from "@/utils/date";
import { useRouter } from "next/navigation";

export const ListItem = ({ content }: { content: Content }) => {
  const time = content.modifiedAt ? content.modifiedAt : content.createdAt;
  const router = useRouter();
  const handleClick = () => router.push(`/${content.id}`);
  return (
    <div className="flex flex-col px-8 gap-8 pt-8">
      <div className="flex flex-row justify-between">
        <div
          onClick={handleClick}
          className="flex flex-col w-full justify-between"
        >
          <div className="flex flex-col w-19/20 gap-2">
            <h1 className="text-xl font-bold">{content.title}</h1>
            <h2>{content.summary}</h2>
          </div>
          <div className="flex gap-2 items-center">
            <p className="text-sm text-gray-500">{formatToKST(time)}</p>
            {content.category ? <Category category={content.category} /> : null}
          </div>
        </div>
        <div className="flex bg-amber-100 w-35 h-35 items-center justify-center">
          {content.imageUrl ? (
            <img src={content.imageUrl} />
          ) : (
            <img src="/icons/image.svg" className="w-10 h-10" />
          )}
        </div>
      </div>
      <hr className="border border-[0.5px] border-gray-300" />
    </div>
  );
};
