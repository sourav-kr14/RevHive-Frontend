export default function AnalyticsCards({ data }) {
  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        marginBottom: "30px",
      }}
    >
      <Card title="Total Users" value={data.totalUsers} />
      <Card title="Active Users" value={data.activeUsers} />
      <Card title="New Users" value={data.newUsers} />
      <Card title="DAU" value={data.dau} />
      <Card title="MAU" value={data.mau} />
    </div>
  );
}

function Card({ title, value }) {
  return (
    <div
      style={{
        padding: "20px",
        borderRadius: "10px",
        background: "#1e1e2f",
        color: "white",
        width: "150px",
      }}
    >
      <p style={{ fontSize: "14px" }}>{title}</p>
      <h2>{value}</h2>
    </div>
  );
}
