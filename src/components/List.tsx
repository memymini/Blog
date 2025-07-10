import { Content } from "@/type/content";
import ListItem from "@/components/ui/ListItem";

export default function List({ contents }: { contents: Content[] }) {
  return (
    <div className="flex flex-col">
      {contents &&
        contents.map((content) => (
          <ListItem key={content.id} content={content} />
        ))}
    </div>
  );
}
