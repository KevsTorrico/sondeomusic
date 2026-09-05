import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "./Dashboard.css";

export default function DashboardHome() {
  const [stats, setStats] = useState(null);
  const [recentEquipment, setRecentEquipment] = useState([]);
  const [recentAlquileres, setRecentAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);

  async function cargarDatos() {
    setLoading(true);

    const [
      { count: totalEquipos },
      { count: totalCategorias },
      { count: disponibles },
      { count: mantenimiento },
      { data: equiposRecientes },
      { data: alquileresRecientes },
    ] = await Promise.all([
      supabase.from("equipos").select("*", { count: "exact", head: true }),
      supabase.from("categorias").select("*", { count: "exact", head: true }),
      supabase
        .from("equipos")
        .select("*", { count: "exact", head: true })
        .eq("disponibilidad", "disponible"),
      supabase
        .from("equipos")
        .select("*", { count: "exact", head: true })
        .eq("disponibilidad", "mantenimiento"),
      supabase
        .from("equipos")
        .select("id, codigo, informacion, disponibilidad, categorias ( nombre )")
        .order("created_at", { ascending: false })
        .limit(4),
      supabase
        .from("alquileres")
        .select("id, fecha_inicio, fecha_fin, estado, clientes ( nombre, apellidos )")
        .order("created_at", { ascending: false })
        .limit(4),
    ]);

    setStats({
      totalEquipos: totalEquipos ?? 0,
      totalCategorias: totalCategorias ?? 0,
      disponibles: disponibles ?? 0,
      mantenimiento: mantenimiento ?? 0,
    });
    setRecentEquipment(equiposRecientes ?? []);
    setRecentAlquileres(alquileresRecientes ?? []);
    setLoading(false);
  }

  useEffect(() => {
    cargarDatos();
  }, []);

  const porcentaje = (n) =>
    stats?.totalEquipos ? Math.round((n / stats.totalEquipos) * 100) : 0;

  const statsCards = stats
    ? [
        { label: "Equipos", value: stats.totalEquipos, icon: "▣" },
        { label: "Categorías", value: stats.totalCategorias, icon: "◫" },
        { label: "Disponibles", value: stats.disponibles, detail: `${porcentaje(stats.disponibles)}% del inventario`, icon: "✓" },
        { label: "En mantenimiento", value: stats.mantenimiento, detail: `${porcentaje(stats.mantenimiento)}% del inventario`, icon: "⚙" },
      ]
    : [];

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

      {loading ? (
        <p>Cargando...</p>
      ) : (
        <>
          <section className="stats-grid">
            {statsCards.map((stat) => (
              <article className="stat-card" key={stat.label}>
                <div className="stat-top">
                  <span className="stat-label">{stat.label}</span>
                  <span className="stat-icon">{stat.icon}</span>
                </div>
                <div className="stat-value">{stat.value}</div>
                {stat.detail && <div className="stat-detail">{stat.detail}</div>}
              </article>
            ))}
          </section>

          <section className="dashboard-grid">
            <article className="dashboard-card activity-card">
              <div className="card-header">
                <div>
                  <span className="card-eyebrow">MOVIMIENTOS</span>
                  <h2>Alquileres recientes</h2>
                </div>
              </div>

              <div className="activity-list">
                {recentAlquileres.length === 0 && <p>Todavía no hay alquileres registrados.</p>}

                {recentAlquileres.map((a) => (
                  <div className="activity-item" key={a.id}>
                    <div className="activity-icon">
                      {a.estado === "finalizado" ? "✓" : a.estado === "cancelado" ? "×" : "↔"}
                    </div>
                    <div className="activity-content">
                      <strong>{a.clientes?.nombre} {a.clientes?.apellidos}</strong>
                      <span>{a.fecha_inicio} → {a.fecha_fin} · {a.estado}</span>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="dashboard-card inventory-card">
              <div className="card-header">
                <div>
                  <span className="card-eyebrow">INVENTARIO</span>
                  <h2>Equipos recientes</h2>
                </div>
              </div>

              <div className="equipment-list">
                {recentEquipment.length === 0 && <p>Todavía no hay equipos registrados.</p>}

                {recentEquipment.map((equipment) => (
                  <div className="equipment-item" key={equipment.id}>
                    <div className="equipment-image">▣</div>
                    <div className="equipment-info">
                      <strong>{equipment.codigo}</strong>
                      <span>{equipment.categorias?.nombre} · {equipment.informacion || "—"}</span>
                    </div>
                    <span
                      className={`status ${
                        equipment.disponibilidad === "disponible" ? "available" : "maintenance"
                      }`}
                    >
                      {equipment.disponibilidad}
                    </span>
                  </div>
                ))}
              </div>
            </article>
          </section>
        </>
      )}
    </>
  );
}