import "./Dashboard.css";

export default function DashboardHome() {
  const stats = [
    { label: "Equipos", value: "128", detail: "+8 este mes", icon: "▣" },
    { label: "Categorías", value: "14", detail: "+2 este mes", icon: "◫" },
    { label: "Disponibles", value: "96", detail: "75% del inventario", icon: "✓" },
    { label: "En mantenimiento", value: "12", detail: "9% del inventario", icon: "⚙" },
  ];

  const recentEquipment = [
    { name: "JBL VRX928LA", category: "Parlante", status: "Disponible", code: "SON-00128" },
    { name: "Shure SM58", category: "Micrófono", status: "Disponible", code: "SON-00127" },
    { name: "Behringer P1", category: "In-Ear", status: "Mantenimiento", code: "SON-00126" },
    { name: "Mackie DL32R", category: "Consola", status: "Disponible", code: "SON-00125" },
  ];

  return (
    <>
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-eyebrow">PANEL DE CONTROL</span>
          <h1>Dashboard</h1>
          <p>Bienvenido de nuevo. Aquí tienes un resumen de tu inventario.</p>
        </div>

        <div className="header-actions">
          <div className="search-box">
            <span>⌕</span>
            <input type="text" placeholder="Buscar..." />
            <kbd>⌘ K</kbd>
          </div>
          <button className="notification-button">
            ♢<span className="notification-dot" />
          </button>
          <div className="header-avatar">KT</div>
        </div>
      </header>

      <section className="stats-grid">
        {stats.map((stat) => (
          <article className="stat-card" key={stat.label}>
            <div className="stat-top">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-icon">{stat.icon}</span>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-detail">{stat.detail}</div>
          </article>
        ))}
      </section>

      <section className="dashboard-grid">
        <article className="dashboard-card activity-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">ACTIVIDAD</span>
              <h2>Actividad reciente</h2>
            </div>
            <button className="card-link">Ver todo</button>
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon">+</div>
              <div className="activity-content">
                <strong>Nuevo equipo agregado</strong>
                <span>JBL VRX928LA fue añadido al inventario</span>
                <small>Hace 12 minutos</small>
              </div>
            </div>
          </div>
        </article>

        <article className="dashboard-card inventory-card">
          <div className="card-header">
            <div>
              <span className="card-eyebrow">INVENTARIO</span>
              <h2>Equipos recientes</h2>
            </div>
            <button className="add-button">+ Agregar</button>
          </div>

          <div className="equipment-list">
            {recentEquipment.map((equipment) => (
              <div className="equipment-item" key={equipment.code}>
                <div className="equipment-image">▣</div>
                <div className="equipment-info">
                  <strong>{equipment.name}</strong>
                  <span>{equipment.category} · {equipment.code}</span>
                </div>
                <span
                  className={`status ${
                    equipment.status === "Disponible" ? "available" : "maintenance"
                  }`}
                >
                  {equipment.status}
                </span>
              </div>
            ))}
          </div>

          <button className="view-inventory">Ver inventario completo →</button>
        </article>
      </section>
    </>
  );
}