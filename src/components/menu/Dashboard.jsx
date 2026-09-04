import "./Dashboard.css";
import logoIcon from "../../assets/logo-mixer.jpeg";

export default function Dashboard({ onLogout }) {
    const stats = [
    {
      label: "Equipos",
      value: "128",
      detail: "+8 este mes",
      icon: "▣",
    },
    {
      label: "Categorías",
      value: "14",
      detail: "+2 este mes",
      icon: "◫",
    },
    {
      label: "Disponibles",
      value: "96",
      detail: "75% del inventario",
      icon: "✓",
    },
    {
      label: "En mantenimiento",
      value: "12",
      detail: "9% del inventario",
      icon: "⚙",
    },
  ];

  const recentEquipment = [
    {
      name: "JBL VRX928LA",
      category: "Parlante",
      status: "Disponible",
      code: "SON-00128",
    },
    {
      name: "Shure SM58",
      category: "Micrófono",
      status: "Disponible",
      code: "SON-00127",
    },
    {
      name: "Behringer P1",
      category: "In-Ear",
      status: "Mantenimiento",
      code: "SON-00126",
    },
    {
      name: "Mackie DL32R",
      category: "Consola",
      status: "Disponible",
      code: "SON-00125",
    },
  ];

  return (
    <div className="dashboard">

      {/* ================= SIDEBAR ================= */}

      <aside className="dashboard-sidebar">

        <div className="sidebar-brand">
          <img
            src={logoIcon}
            alt="Sondeo Music"
            className="sidebar-logo"
          />

          <div className="sidebar-brand-text">
            <strong style={{ color: "white" }}>SONDEO</strong>
            <span>music</span>
          </div>
        </div>

        <nav className="sidebar-nav">

          <p className="nav-section-title">
            PRINCIPAL
          </p>

          <a
            href="#dashboard"
            className="nav-item active"
          >
            <span className="nav-icon">⌂</span>
            <span>Dashboard</span>
          </a>

          <a
            href="#inventario"
            className="nav-item"
          >
            <span className="nav-icon">▣</span>
            <span>Inventario</span>
          </a>

          <a
            href="#categorias"
            className="nav-item"
          >
            <span className="nav-icon">◫</span>
            <span>Categorías</span>
          </a>

          <a
            href="#movimientos"
            className="nav-item"
          >
            <span className="nav-icon">↔</span>
            <span>Movimientos</span>
          </a>

          <p className="nav-section-title">
            ADMINISTRACIÓN
          </p>

          <a
            href="#usuarios"
            className="nav-item"
          >
            <span className="nav-icon">♙</span>
            <span>Usuarios</span>
          </a>

          <a
            href="#reportes"
            className="nav-item"
          >
            <span className="nav-icon">▥</span>
            <span>Reportes</span>
          </a>

          <a
            href="#configuracion"
            className="nav-item"
          >
            <span className="nav-icon">⚙</span>
            <span>Configuración</span>
          </a>

        </nav>

        <div className="sidebar-bottom">

          <div className="sidebar-user">
            <div className="user-avatar">
              KT
            </div>

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

      <main className="dashboard-main">

        {/* HEADER */}

        <header className="dashboard-header">

          <div className="header-title">
            <span className="header-eyebrow">
              PANEL DE CONTROL
            </span>

            <h1>
              Dashboard
            </h1>

            <p>
              Bienvenido de nuevo. Aquí tienes un resumen de tu inventario.
            </p>
          </div>

          <div className="header-actions">

            <div className="search-box">
              <span>⌕</span>

              <input
                type="text"
                placeholder="Buscar..."
              />

              <kbd>⌘ K</kbd>
            </div>

            <button className="notification-button">
              ♢
              <span className="notification-dot" />
            </button>

            <div className="header-avatar">
              KT
            </div>

          </div>

        </header>


        {/* ================= ESTADÍSTICAS ================= */}

        <section className="stats-grid">

          {stats.map((stat) => (
            <article
              className="stat-card"
              key={stat.label}
            >

              <div className="stat-top">

                <span className="stat-label">
                  {stat.label}
                </span>

                <span className="stat-icon">
                  {stat.icon}
                </span>

              </div>

              <div className="stat-value">
                {stat.value}
              </div>

              <div className="stat-detail">
                {stat.detail}
              </div>

            </article>
          ))}

        </section>


        {/* ================= CONTENIDO INFERIOR ================= */}

        <section className="dashboard-grid">

          {/* ACTIVIDAD */}

          <article className="dashboard-card activity-card">

            <div className="card-header">

              <div>
                <span className="card-eyebrow">
                  ACTIVIDAD
                </span>

                <h2>
                  Actividad reciente
                </h2>
              </div>

              <button className="card-link">
                Ver todo
              </button>

            </div>

            <div className="activity-list">

              <div className="activity-item">

                <div className="activity-icon">
                  +
                </div>

                <div className="activity-content">
                  <strong>
                    Nuevo equipo agregado
                  </strong>

                  <span>
                    JBL VRX928LA fue añadido al inventario
                  </span>

                  <small>
                    Hace 12 minutos
                  </small>
                </div>

              </div>


              <div className="activity-item">

                <div className="activity-icon">
                  ↻
                </div>

                <div className="activity-content">
                  <strong>
                    Equipo actualizado
                  </strong>

                  <span>
                    Mackie DL32R cambió de ubicación
                  </span>

                  <small>
                    Hace 1 hora
                  </small>
                </div>

              </div>


              <div className="activity-item">

                <div className="activity-icon">
                  ✓
                </div>

                <div className="activity-content">
                  <strong>
                    Equipo devuelto
                  </strong>

                  <span>
                    Behringer P1 volvió a estar disponible
                  </span>

                  <small>
                    Hace 3 horas
                  </small>
                </div>

              </div>


              <div className="activity-item">

                <div className="activity-icon">
                  !
                </div>

                <div className="activity-content">
                  <strong>
                    Equipo enviado a mantenimiento
                  </strong>

                  <span>
                    Shure SM58 requiere revisión
                  </span>

                  <small>
                    Ayer
                  </small>
                </div>

              </div>

            </div>

          </article>


          {/* INVENTARIO */}

          <article className="dashboard-card inventory-card">

            <div className="card-header">

              <div>
                <span className="card-eyebrow">
                  INVENTARIO
                </span>

                <h2>
                  Equipos recientes
                </h2>
              </div>

              <button className="add-button">
                + Agregar
              </button>

            </div>

            <div className="equipment-list">

              {recentEquipment.map((equipment) => (

                <div
                  className="equipment-item"
                  key={equipment.code}
                >

                  <div className="equipment-image">
                    ▣
                  </div>

                  <div className="equipment-info">

                    <strong>
                      {equipment.name}
                    </strong>

                    <span>
                      {equipment.category} · {equipment.code}
                    </span>

                  </div>

                  <span
                    className={`status ${
                      equipment.status === "Disponible"
                        ? "available"
                        : "maintenance"
                    }`}
                  >
                    {equipment.status}
                  </span>

                </div>

              ))}

            </div>

            <button className="view-inventory">
              Ver inventario completo →
            </button>

          </article>

        </section>


        {/* ================= ACCIONES RÁPIDAS ================= */}

        <section className="quick-actions">

          <div className="quick-title">
            <span className="card-eyebrow">
              ACCIONES RÁPIDAS
            </span>

            <h2>
              ¿Qué quieres hacer?
            </h2>
          </div>

          <div className="quick-grid">

            <button className="quick-card">
              <span className="quick-icon">+</span>

              <div>
                <strong>
                  Agregar equipo
                </strong>

                <span>
                  Registrar un nuevo equipo
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>


            <button className="quick-card">
              <span className="quick-icon">▣</span>

              <div>
                <strong>
                  Ver inventario
                </strong>

                <span>
                  Explorar todos los equipos
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>


            <button className="quick-card">
              <span className="quick-icon">▥</span>

              <div>
                <strong>
                  Generar reporte
                </strong>

                <span>
                  Consultar reportes
                </span>
              </div>

              <span className="quick-arrow">
                →
              </span>
            </button>

          </div>

        </section>

      </main>

    </div>
  );
}