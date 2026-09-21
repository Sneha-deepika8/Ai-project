import AppLayout from "../layouts/AppLayout";
import AIInsightCard from "../components/AIInsightCard";

export default function AIInsights() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1>AI Insights</h1>
      </div>
      <p className="muted">
        Get personalized, AI-generated suggestions based on your income,
        spending patterns and savings goals.
      </p>
      <AIInsightCard />
    </AppLayout>
  );
}
