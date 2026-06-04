import Card from "./Card";

export default function AnalyticsCards({ data = {} }) {
  const cards = [
    { id: "users", title: "Total Users", value: data?.users },
    { id: "posts", title: "Posts", value: data?.posts },
    { id: "comments", title: "Comments", value: data?.comments },
    { id: "reports", title: "Reports", value: data?.reports },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.id} title={card.title} value={card.value ?? 0} />
      ))}
    </div>
  );
}
