import { Link } from "react-router-dom";

const FEATURES = [
  {
    icon: "📊",
    title: "Smart Dashboard",
    text: "See your income, expenses and balance at a glance, updated in real time.",
  },
  {
    icon: "🎯",
    title: "Goal Tracking",
    text: "Set savings goals and get a clear daily or monthly saving plan to hit them.",
  },
  {
    icon: "📈",
    title: "Expense Analytics",
    text: "Understand exactly where your money goes with category breakdowns and trends.",
  },
  {
    icon: "🤖",
    title: "AI-Powered Insights",
    text: "Get personalized, educational suggestions generated from your real spending data.",
  },
  {
    icon: "🔒",
    title: "Bank-Grade Security",
    text: "JWT authentication, BCrypt password hashing and strict data isolation per user.",
  },
  {
    icon: "📱",
    title: "Fully Responsive",
    text: "A clean, modern experience on desktop, tablet and mobile alike.",
  },
];

const STEPS = [
  {
    step: "1",
    title: "Sign up securely",
    text: "Create an account protected with industry-standard encryption.",
  },
  {
    step: "2",
    title: "Log your transactions",
    text: "Add income and expenses as they happen, categorized automatically.",
  },
  {
    step: "3",
    title: "Set your goals",
    text: "Define what you are saving for and by when.",
  },
  {
    step: "4",
    title: "Get AI insights",
    text: "Receive personalized suggestions to reach your goals faster.",
  },
];

export default function Landing() {
  return (
    <div className="landing-page">
      <header className="landing-nav">
        <div className="navbar-brand">
          <span className="logo-mark">⚡</span>
          <span>FinPulse AI</span>
        </div>
        <div className="landing-nav-actions">
          <Link to="/login" className="btn btn-ghost">
            Login
          </Link>
          <Link to="/register" className="btn btn-primary">
            Get Started
          </Link>
        </div>
      </header>

      <section className="hero">
        <h1>
          Understand your spending. Reach your goals.
          <br />
          Make smarter financial decisions.
        </h1>
        <p>
          FinPulse AI turns your everyday transactions into clear insights,
          realistic savings plans, and personalized AI-powered guidance.
        </p>
        <div className="hero-actions">
          <Link to="/register" className="btn btn-primary btn-lg">
            Start for free
          </Link>
          <Link to="/login" className="btn btn-secondary btn-lg">
            I already have an account
          </Link>
        </div>
      </section>

      <section className="landing-section">
        <h2>Features</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div key={f.title} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section alt">
        <h2>How It Works</h2>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div key={s.step} className="step-card">
              <div className="step-number">{s.step}</div>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section cta">
        <h2>Ready to take control of your finances?</h2>
        <p>Join FinPulse AI today and start building better money habits.</p>
        <Link to="/register" className="btn btn-primary btn-lg">
          Create your free account
        </Link>
      </section>

      <footer className="landing-footer">
        <p>
          FinPulse AI — educational finance tooling, not professional financial
          advice.
        </p>
      </footer>
    </div>
  );
}
