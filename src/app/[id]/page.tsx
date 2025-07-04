import { Content } from "@/type/content";
import MdViewer from "@/components/post/MdViewer";
import { formatToKST } from "@/utils/formatDate";

export default async function ContentDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const contentsRes = await fetch("http://localhost:3000/mock/contents.json", {
    cache: "no-store",
  });
  const id = (await params).id;
  const contents = await contentsRes.json();
  const content = await contents.find((item: Content) => item.id === id);
  const date = content.modifiedAt ? content.modifiedAt : content.createdAt;

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex items-end justify-between w-full h-40 bg-amber-100 py-4 px-8">
        <h1 className="text-3xl font-bold">{content.title}</h1>
        <p>작성일: {formatToKST(date)}</p>
      </div>
      <div className="p-16">
        <MdViewer content={content.summary} />
      </div>
    </div>
  );
}
