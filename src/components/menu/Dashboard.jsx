import { useState } from "react";
import "./Dashboard.css";
import logoIcon from "../../assets/logo-mixer.jpeg";
import DashboardHome from "./DashboardHome";
import CategoriasPage from "../Categorias/CategoriasPage";

const NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", icon: "⌂" },
  { key: "inventario", label: "Inventario", icon: "▣" },
  { key: "categorias", label: "Categorías", icon: "◫" },
  { key: "movimientos", label: "Movimientos", icon: "↔" },
];

const ADMIN_ITEMS = [
  { key: "usuarios", label: "Usuarios", icon: "♙" },
  { key: "reportes", label: "Reportes", icon: "▥" },
  { key: "configuracion", label: "Configuración", icon: "⚙" },
];

export default function Dashboard({ onLogout }) {
  const [view, setView] = useState("dashboard");

  function renderView() {
    switch (view) {
      case "categorias":
        return <CategoriasPage />;
      case "dashboard":
        return <DashboardHome />;
      default:
        return (
          <div className="dashboard-card">
            <p>Este módulo todavía no está construido.</p>
          </div>
        );
    }
  }

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <img src={logoIcon} alt="Sondeo Music" className="sidebar-logo" />
          <div className="sidebar-brand-text">
            <strong style={{ color: "white" }}>SONDEO</strong>
            <span>music</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <p className="nav-section-title">PRINCIPAL</p>

          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? "active" : ""}`}
              onClick={() => setView(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}

          <p className="nav-section-title">ADMINISTRACIÓN</p>

          {ADMIN_ITEMS.map((item) => (
            <button
              key={item.key}
              className={`nav-item ${view === item.key ? "active" : ""}`}
              onClick={() => setView(item.key)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-user">
            <div className="user-avatar">KT</div>
            <div className="sidebar-user-info">
              <strong>Administrador</strong>
              <span>admin@sondeo.com</span>
            </div>
          </div>

          <button className="logout-button" onClick={onLogout}>
            <span>↪</span>
            Cerrar sesión
          </button>
        </div>

      </aside>

      {/* ================= CONTENIDO ================= */}

      <main className="dashboard-main">{renderView()}</main>

    </div>
  );
}