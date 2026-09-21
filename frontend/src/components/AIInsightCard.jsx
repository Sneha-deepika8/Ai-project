import { useState } from "react";
import { aiService } from "../services/apiService";

export default function AIInsightCard() {
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const generate = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiService.analyze();
      setInsight(response.data);
    } catch (err) {
      setError(err.friendlyMessage || "AI service is temporarily unavailable.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-insight-card">
      <div className="ai-insight-header">
        <h3>🤖 AI Financial Insight</h3>
        <button
          className="btn btn-primary btn-sm"
          onClick={generate}
          disabled={loading}
        >
          {loading
            ? "Analyzing..."
            : insight
              ? "Generate New Insight"
              : "Generate Insight"}
        </button>
      </div>

      {loading && <p className="ai-loading">Analyzing your spending...</p>}
      {error && <p className="field-error">{error}</p>}

      {!loading && insight && (
        <div className="ai-insight-body">
          <pre className="ai-insight-text">{insight.insight}</pre>
          <p className="ai-disclaimer">{insight.disclaimer}</p>
        </div>
      )}

      {!loading && !insight && !error && (
        <p className="muted">
          Tap "Generate Insight" to get a personalized breakdown of your
          spending and saving plan.
        </p>
      )}
    </div>
  );
}
