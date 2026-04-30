import Card from "./Card";

export default function AnalyticsCards({ data }) {
  const cards = [
    { title: "Total Users", value: data.totalUsers },
    { title: "Active Users", value: data.activeUsers },
    { title: "New Users", value: data.newUsers },
    { title: "Daily Active Users", value: data.dau },
    { title: "Monthly Active Users", value: data.mau },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {cards.map((card) => (
        <Card key={card.title} {...card} />
      ))}
    </div>
  );
}
