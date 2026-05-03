export default function HashtagBox({ tags, onSelect }) {
  if (!tags.length) return null;

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {tags.map((tag, i) => (
        <span
          key={i}
          onClick={() => onSelect(tag)}
          className="bg-gray-700 px-2 py-1 rounded cursor-pointer hover:bg-gray-600 text-sm"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}
