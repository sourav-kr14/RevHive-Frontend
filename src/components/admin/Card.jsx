export default function Card({ title, value }) {
  return (
    <div className="bg-white/10 p-5 rounded-xl backdrop-blur text-center hover:scale-105 transition">
      <p className="text-gray-400 text-sm">{title}</p>
      <h2 className="text-2xl font-bold">{value}</h2>
    </div>
  );
}
