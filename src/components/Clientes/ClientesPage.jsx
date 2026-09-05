import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../menu/Dashboard.css";
import "./ClientesPage.css";

export default function ClientesPage() {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [busqueda, setBusqueda] = useState("");

  async function cargarClientes() {
    setLoading(true);
    const { data, error } = await supabase
      .from("clientes")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setClientes(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarClientes();
  }, []);

  async function eliminarCliente(id) {
    if (!confirm("¿Eliminar este cliente?")) return;
    const { error } = await supabase.from("clientes").delete().eq("id", id);
    if (error) {
      alert(
        "No se pudo eliminar: " +
          error.message +
          " (probablemente tiene alquileres registrados)"
      );
      return;
    }
    cargarClientes();
  }

  const clientesFiltrados = clientes.filter((c) => {
    if (!busqueda) return true;
    const texto = `${c.nombre} ${c.apellidos} ${c.telefono}`.toLowerCase();
    return texto.includes(busqueda.toLowerCase());
  });

  return (
    <>
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-eyebrow">CLIENTES</span>
          <h1>Clientes</h1>
          <p>Personas o empresas a las que se les alquila equipo.</p>
        </div>
        <div className="header-actions">
          <button
            className="add-button"
            onClick={() => {
              setEditando(null);
              setShowForm(true);
            }}
          >
            + Agregar cliente
          </button>
        </div>
      </header>

      <div className="dashboard-card filtros-bar">
        <input
          type="text"
          placeholder="Buscar por nombre, apellido o teléfono..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {showForm && (
        <ClienteForm
          initialCliente={editando}
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            cargarClientes();
          }}
        />
      )}

      {loading ? (
        <p>Cargando clientes...</p>
      ) : (
        <div className="clientes-tabla dashboard-card">
          {clientesFiltrados.length === 0 && <p>No hay clientes que coincidan.</p>}

          {clientesFiltrados.map((c) => (
            <div className="cliente-fila" key={c.id}>
              <div className="cliente-fila-info">
                <strong>{c.nombre} {c.apellidos}</strong>
                <span>{c.telefono}</span>
                {c.referencia && <small>{c.referencia}</small>}
              </div>

              <div className="cliente-fila-acciones">
                <button
                  onClick={() => {
                    setEditando(c);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button className="cliente-eliminar" onClick={() => eliminarCliente(c.id)}>
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

function ClienteForm({ initialCliente, onCancel, onSaved }) {
  const esEdicion = Boolean(initialCliente);

  const [nombre, setNombre] = useState(initialCliente?.nombre ?? "");
  const [apellidos, setApellidos] = useState(initialCliente?.apellidos ?? "");
  const [telefono, setTelefono] = useState(initialCliente?.telefono ?? "");
  const [referencia, setReferencia] = useState(initialCliente?.referencia ?? "");
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim() || !apellidos.trim() || !telefono.trim()) {
      alert("Nombre, apellidos y teléfono son obligatorios.");
      return;
    }

    setGuardando(true);

    const payload = {
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
      referencia: referencia.trim() || null,
    };

    const { error } = esEdicion
      ? await supabase.from("clientes").update(payload).eq("id", initialCliente.id)
      : await supabase.from("clientes").insert(payload);

    setGuardando(false);

    if (error) {
      alert("No se pudo guardar: " + error.message);
      return;
    }
    onSaved();
  }

  return (
    <form className="dashboard-card cliente-form" onSubmit={handleSubmit}>
      <h2>{esEdicion ? "Editar cliente" : "Agregar cliente"}</h2>

      <div className="cliente-form-grid">
        <label>
          Nombre
          <input value={nombre} onChange={(e) => setNombre(e.target.value)} required />
        </label>

        <label>
          Apellidos
          <input value={apellidos} onChange={(e) => setApellidos(e.target.value)} required />
        </label>

        <label>
          Teléfono
          <input value={telefono} onChange={(e) => setTelefono(e.target.value)} required />
        </label>

        <label>
          Referencia
          <input
            value={referencia}
            onChange={(e) => setReferencia(e.target.value)}
            placeholder="Opcional"
          />
        </label>
      </div>

      <div className="equipo-form-acciones">
        <button type="button" onClick={onCancel} disabled={guardando}>Cancelar</button>
        <button type="submit" className="add-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}