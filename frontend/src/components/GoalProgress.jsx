export default function GoalProgress({ percentage, completed }) {
  const pct = Math.min(100, Math.max(0, percentage || 0));
  return (
    <div className="goal-progress-track">
      <div
        className={`goal-progress-fill ${completed ? "completed" : ""}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
