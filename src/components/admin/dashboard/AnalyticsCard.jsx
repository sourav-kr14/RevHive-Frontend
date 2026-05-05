import Card from "./Card";

export default function AnalyticsCards({ data = {} }) {
  const cards = [
    { id: "total", title: "Total Users", value: data?.totalUsers },
    { id: "active", title: "Active Users", value: data?.activeUsers },
    { id: "new", title: "New Users", value: data?.newUsers },
    { id: "dau", title: "DAU", value: data?.dau },
    { id: "mau", title: "MAU", value: data?.mau },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {cards.map((card) => (
        <Card
          key={card.id}
          title={card.title}
          value={card.value ?? 0} // ✅ safe fallback
        />
      ))}
    </div>
  );
}
