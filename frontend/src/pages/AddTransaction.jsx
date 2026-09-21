import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import TransactionForm from "../components/TransactionForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { transactionService } from "../services/apiService";

export default function AddTransaction() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [initialValue, setInitialValue] = useState(null);
  const [loading, setLoading] = useState(isEdit);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isEdit) return;
    const load = async () => {
      try {
        const response = await transactionService.getById(id);
        setInitialValue(response.data);
      } catch (err) {
        setError(err.friendlyMessage || "Unable to load transaction.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, isEdit]);

  const handleSubmit = async (form) => {
    setSubmitting(true);
    setError(null);
    try {
      if (isEdit) {
        await transactionService.update(id, form);
      } else {
        await transactionService.create(form);
      }
      navigate("/transactions");
    } catch (err) {
      setError(err.friendlyMessage || "Unable to save transaction.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1>{isEdit ? "Edit Transaction" : "Add Transaction"}</h1>
      </div>

      {loading && <LoadingSpinner label="Loading transaction..." />}
      <ErrorMessage message={error} />

      {!loading && (
        <TransactionForm
          initialValue={initialValue}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/transactions")}
        />
      )}
    </AppLayout>
  );
}
