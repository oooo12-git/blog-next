export default function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {tags.map((tag) => (
        <span
          key={tag}
          className="border-[0.5px] border-black bg-[#ECEAEA] px-2 rounded-md text-sm text-[#706E6E]"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
