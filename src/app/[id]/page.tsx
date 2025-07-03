import { Content } from "@/type/content";
import MdViewer from "@/components/post/MdViewer";

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

  return (
    <div className="w-full lg:w-1/2">
      <div className="flex flex-col items-baseline w-full h-50 bg-amber-100">
        <h1 className="text-2xl font-bold">{content.title}</h1>
      </div>

      <MdViewer content={content.summary} />
    </div>
  );
}
