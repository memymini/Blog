export default function Category({ category }: { category: string }) {
  return (
    <div className="px-3 py-1 bg-amber-200 rounded-2xl">
      <p className="text-xs">{category}</p>
    </div>
  );
}
