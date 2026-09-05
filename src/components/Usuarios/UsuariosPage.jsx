import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../menu/Dashboard.css";
import "./UsuariosPage.css";

const FUNCTION_URL = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/manage-users`;

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function llamarFuncion(body) {
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch(FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  }

  async function cargarUsuarios() {
    setLoading(true);
    const result = await llamarFuncion({ action: "list" });
    if (result.error) {
      console.error(result.error);
    } else {
      setUsuarios(result.usuarios);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarUsuarios();
  }, []);

  async function crearUsuario(e) {
    e.preventDefault();
    setError("");

    if (!email.trim() || password.length < 6) {
      setError("Correo válido y contraseña de al menos 6 caracteres.");
      return;
    }

    setGuardando(true);
    const result = await llamarFuncion({ action: "create", email: email.trim(), password });
    setGuardando(false);

    if (result.error) {
      setError(result.error);
      return;
    }
    setEmail("");
    setPassword("");
    setShowForm(false);
    cargarUsuarios();
  }

  async function eliminarUsuario(id) {
    if (!confirm("¿Eliminar este administrador? Ya no podrá iniciar sesión.")) return;
    const result = await llamarFuncion({ action: "delete", id });
    if (result.error) {
      alert("No se pudo eliminar: " + result.error);
      return;
    }
    cargarUsuarios();
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-eyebrow">ADMINISTRACIÓN</span>
          <h1>Usuarios</h1>
          <p>Administradores con acceso al sistema.</p>
        </div>
        <div className="header-actions">
          <button className="add-button" onClick={() => setShowForm(true)}>
            + Nuevo administrador
          </button>
        </div>
      </header>

      {showForm && (
        <form className="dashboard-card usuario-form" onSubmit={crearUsuario}>
          <h2>Nuevo administrador</h2>

          {error && <p className="form-error-usuarios">{error}</p>}

          <div className="usuario-form-grid">
            <label>
              Correo electrónico
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </label>
            <label>
              Contraseña
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={6}
                required
              />
            </label>
          </div>

          <div className="equipo-form-acciones">
            <button type="button" onClick={() => setShowForm(false)} disabled={guardando}>
              Cancelar
            </button>
            <button type="submit" className="add-button" disabled={guardando}>
              {guardando ? "Creando..." : "Crear administrador"}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p>Cargando usuarios...</p>
      ) : (
        <div className="dashboard-card usuarios-tabla">
          {usuarios.map((u) => (
            <div className="usuario-fila" key={u.id}>
              <div>
                <strong>{u.email}</strong>
                <span>
                  {u.last_sign_in_at
                    ? `Último acceso: ${new Date(u.last_sign_in_at).toLocaleDateString()}`
                    : "Nunca ha iniciado sesión"}
                </span>
              </div>
              <button className="usuario-eliminar" onClick={() => eliminarUsuario(u.id)}>
                Eliminar
              </button>
            </div>
          ))}
        </div>
      )}
    </>
  );
}