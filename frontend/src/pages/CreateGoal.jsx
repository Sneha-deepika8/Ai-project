import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import GoalForm from "../components/GoalForm";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { goalService } from "../services/apiService";

export default function CreateGoal() {
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
        const response = await goalService.getById(id);
        setInitialValue({
          name: response.data.name,
          targetAmount: response.data.targetAmount,
          currentAmount: response.data.currentAmount,
          targetDate: response.data.targetDate,
          description: response.data.description || "",
        });
      } catch (err) {
        setError(err.friendlyMessage || "Unable to load goal.");
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
        await goalService.update(id, form);
      } else {
        await goalService.create(form);
      }
      navigate("/goals");
    } catch (err) {
      setError(err.friendlyMessage || "Unable to save goal.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="page-header">
        <h1>{isEdit ? "Edit Goal" : "Create New Goal"}</h1>
      </div>

      {loading && <LoadingSpinner label="Loading goal..." />}
      <ErrorMessage message={error} />

      {!loading && (
        <GoalForm
          initialValue={initialValue}
          submitting={submitting}
          onSubmit={handleSubmit}
          onCancel={() => navigate("/goals")}
        />
      )}
    </AppLayout>
  );
}
