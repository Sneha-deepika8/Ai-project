import { useState } from "react";

const emptyForm = {
  name: "",
  targetAmount: "",
  currentAmount: "0",
  targetDate: "",
  description: "",
};

export default function GoalForm({
  initialValue,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(initialValue || emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name.trim()) newErrors.name = "Goal name is required.";
    if (!form.targetAmount || Number(form.targetAmount) <= 0)
      newErrors.targetAmount = "Target amount must be greater than 0.";
    if (
      form.currentAmount &&
      Number(form.currentAmount) > Number(form.targetAmount)
    ) {
      newErrors.currentAmount = "Current amount cannot exceed target amount.";
    }
    if (!form.targetDate) newErrors.targetDate = "Target date is required.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      ...form,
      targetAmount: Number(form.targetAmount),
      currentAmount: Number(form.currentAmount || 0),
    });
  };

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      <div className="form-row">
        <label htmlFor="name">Goal name</label>
        <input
          id="name"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="e.g. Buy Laptop"
        />
        {errors.name && <span className="field-error">{errors.name}</span>}
      </div>

      <div className="form-row">
        <label htmlFor="targetAmount">Target amount (₹)</label>
        <input
          id="targetAmount"
          name="targetAmount"
          type="number"
          min="0"
          step="0.01"
          value={form.targetAmount}
          onChange={handleChange}
        />
        {errors.targetAmount && (
          <span className="field-error">{errors.targetAmount}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="currentAmount">Current amount saved (₹)</label>
        <input
          id="currentAmount"
          name="currentAmount"
          type="number"
          min="0"
          step="0.01"
          value={form.currentAmount}
          onChange={handleChange}
        />
        {errors.currentAmount && (
          <span className="field-error">{errors.currentAmount}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="targetDate">Target date</label>
        <input
          id="targetDate"
          name="targetDate"
          type="date"
          value={form.targetDate}
          onChange={handleChange}
        />
        {errors.targetDate && (
          <span className="field-error">{errors.targetDate}</span>
        )}
      </div>

      <div className="form-row">
        <label htmlFor="description">Description (optional)</label>
        <textarea
          id="description"
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="What is this goal for?"
        />
      </div>

      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Goal"}
        </button>
      </div>
    </form>
  );
}
