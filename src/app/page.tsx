import List from "@/components/list/List";

export default async function Home() {
  const contentsRes = await fetch("http://localhost:3000/mock/contents.json");
  const contents = await contentsRes.json();

  return (
    <div className="w-full lg:w-1/2 bg-white">
      <div className="w-full h-40 bg-amber-100">
        <h1>title</h1>
      </div>
      <div className="h-[calc(100vh-160px)] overflow-y-scroll scrollbar-none">
        <List contents={contents} />
      </div>
    </div>
  );
}
