import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  { to: "/dashboard", label: "Dashboard", icon: "📊" },
  { to: "/transactions", label: "Transactions", icon: "💳" },
  { to: "/goals", label: "Goals", icon: "🎯" },
  { to: "/analytics", label: "Analytics", icon: "📈" },
  { to: "/ai-insights", label: "AI Insights", icon: "🤖" },
  { to: "/profile", label: "Profile", icon: "👤" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { logout, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-brand">
          <span className="logo-mark">⚡</span>
          <span>FinPulse AI</span>
        </div>

        <nav className="navbar-links">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? "nav-link active" : "nav-link"
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="navbar-right">
          <span className="user-chip">{user?.fullName}</span>
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>

        <button
          className="hamburger"
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          ☰
        </button>
      </header>

      {open && (
        <div className="mobile-menu">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="mobile-nav-link"
            >
              <span>{item.icon}</span> {item.label}
            </NavLink>
          ))}
          <button className="btn btn-ghost" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}

      <nav className="bottom-nav">
        {NAV_ITEMS.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              isActive ? "bottom-nav-link active" : "bottom-nav-link"
            }
          >
            <span>{item.icon}</span>
            <span className="bottom-nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </>
  );
}
