import { Content } from "@/type/content";

export default async function ContentDetail({
  params,
}: {
  params: { id: string };
}) {
  const contentsRes = await fetch("http://localhost:3000/mock/contents.json", {
    cache: "no-store",
  });
  const contents = await contentsRes.json();
  const content = contents.find((item: Content) => item.id === params.id);

  return (
    <div className="w-full lg:w-1/2">
      <h1 className="text-2xl font-bold">{content.title}</h1>
      <h2>{content.summary}</h2>
    </div>
  );
}
