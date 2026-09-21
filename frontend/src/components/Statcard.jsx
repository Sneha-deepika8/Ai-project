export default function StatCard({ label, value, icon, tone = "default" }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-icon">{icon}</div>
      <div>
        <p className="stat-card-label">{label}</p>
        <p className="stat-card-value">{value}</p>
      </div>
    </div>
  );
}
