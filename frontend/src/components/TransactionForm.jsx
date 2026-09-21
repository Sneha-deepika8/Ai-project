import { useState } from "react";
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  categoryLabel,
} from "../utils/format";

const emptyForm = {
  type: "EXPENSE",
  amount: "",
  category: "FOOD",
  description: "",
  transactionDate: new Date().toISOString().slice(0, 10),
};

export default function TransactionForm({
  initialValue,
  onSubmit,
  onCancel,
  submitting,
}) {
  const [form, setForm] = useState(initialValue || emptyForm);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleTypeChange = (type) => {
    setForm((prev) => ({
      ...prev,
      type,
      category: type === "INCOME" ? "SALARY" : "FOOD",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!form.amount || Number(form.amount) <= 0) {
      newErrors.amount = "Amount must be greater than 0.";
    }

    if (!form.category) {
      newErrors.category = "Category is required.";
    }

    if (!form.transactionDate) {
      newErrors.transactionDate = "Date is required.";
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validate()) return;

    onSubmit({
      ...form,
      amount: Number(form.amount),
    });
  };

  const categories =
    form.type === "INCOME" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <form className="form-card" onSubmit={handleSubmit}>
      {/* Transaction Type */}
      <div className="form-row">
        <label>Transaction Type</label>

        <div className="segmented">
          <button
            type="button"
            className={
              form.type === "EXPENSE" ? "segmented-btn active" : "segmented-btn"
            }
            onClick={() => handleTypeChange("EXPENSE")}
          >
            Expense
          </button>

          <button
            type="button"
            className={
              form.type === "INCOME" ? "segmented-btn active" : "segmented-btn"
            }
            onClick={() => handleTypeChange("INCOME")}
          >
            Income
          </button>
        </div>
      </div>

      {/* Amount */}
      <div className="form-row">
        <label htmlFor="amount">Amount (₹)</label>

        <input
          id="amount"
          name="amount"
          type="number"
          min="0"
          step="0.01"
          value={form.amount}
          onChange={handleChange}
          placeholder="0.00"
        />

        {errors.amount && <span className="field-error">{errors.amount}</span>}
      </div>

      {/* Category */}
      <div className="form-row">
        <label htmlFor="category">Category</label>

        <select
          id="category"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {categoryLabel(category)}
            </option>
          ))}
        </select>

        {errors.category && (
          <span className="field-error">{errors.category}</span>
        )}
      </div>

      {/* Description */}
      <div className="form-row">
        <label htmlFor="description">Description (optional)</label>

        <input
          id="description"
          name="description"
          type="text"
          value={form.description}
          onChange={handleChange}
          placeholder="e.g. Restaurant dinner"
        />
      </div>

      {/* Date */}
      <div className="form-row">
        <label htmlFor="transactionDate">Date</label>

        <input
          id="transactionDate"
          name="transactionDate"
          type="date"
          value={form.transactionDate}
          onChange={handleChange}
        />

        {errors.transactionDate && (
          <span className="field-error">{errors.transactionDate}</span>
        )}
      </div>

      {/* Buttons */}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>

        <button type="submit" className="btn btn-primary" disabled={submitting}>
          {submitting ? "Saving..." : "Save Transaction"}
        </button>
      </div>
    </form>
  );
}
