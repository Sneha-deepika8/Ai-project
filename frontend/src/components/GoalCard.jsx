import { useState } from "react";
import GoalProgress from "./GoalProgress";
import { formatCurrency, formatDate } from "../utils/format";

export default function GoalCard({ goal, onContribute, onEdit, onDelete }) {
  const [contributing, setContributing] = useState(false);
  const [amount, setAmount] = useState("");
  const isCompleted = goal.status === "COMPLETED";

  const submitContribution = (e) => {
    e.preventDefault();
    if (!amount || Number(amount) <= 0) return;
    onContribute(goal.id, Number(amount));
    setAmount("");
    setContributing(false);
  };

  return (
    <div className={`goal-card ${isCompleted ? "goal-completed" : ""}`}>
      <div className="goal-card-header">
        <h3>{goal.name}</h3>
        {isCompleted && <span className="goal-status-badge">🎉 Completed</span>}
        {goal.status === "EXPIRED" && (
          <span className="goal-status-badge expired">Expired</span>
        )}
      </div>

      <p className="goal-amounts">
        {formatCurrency(goal.currentAmount)}{" "}
        <span className="muted">/ {formatCurrency(goal.targetAmount)}</span>
      </p>

      <GoalProgress
        percentage={goal.percentageCompleted}
        completed={isCompleted}
      />
      <p className="goal-percentage">
        {goal.percentageCompleted}% completed ·{" "}
        {formatCurrency(goal.remainingAmount)} remaining
      </p>

      <div className="goal-meta-grid">
        <div>
          <p className="muted small">Target date</p>
          <p>{formatDate(goal.targetDate)}</p>
        </div>
        <div>
          <p className="muted small">Monthly saving</p>
          <p>{formatCurrency(goal.requiredMonthlySaving)}</p>
        </div>
        <div>
          <p className="muted small">Daily saving</p>
          <p>{formatCurrency(goal.requiredDailySaving)}</p>
        </div>
      </div>

      {goal.description && (
        <p className="goal-description">{goal.description}</p>
      )}

      {contributing ? (
        <form className="goal-contribute-form" onSubmit={submitContribution}>
          <input
            type="number"
            min="0"
            step="0.01"
            placeholder="Amount to add"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            autoFocus
          />
          <button type="submit" className="btn btn-primary btn-sm">
            Add
          </button>
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={() => setContributing(false)}
          >
            Cancel
          </button>
        </form>
      ) : (
        <div className="goal-actions">
          <button
            className="btn btn-primary btn-sm"
            disabled={isCompleted}
            onClick={() => setContributing(true)}
          >
            Add Money
          </button>
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => onEdit(goal)}
          >
            Edit
          </button>
          <button
            className="btn btn-danger btn-sm"
            onClick={() => onDelete(goal)}
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
