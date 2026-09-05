import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../menu/Dashboard.css";
import "./InventarioPage.css";

const ESTADOS = ["bueno", "regular", "malo"];

export default function InventarioPage() {
  const [categorias, setCategorias] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingEquipo, setEditingEquipo] = useState(null);

  const [filtroCategoria, setFiltroCategoria] = useState("");
  const [filtroDisponibilidad, setFiltroDisponibilidad] = useState("");
  const [busqueda, setBusqueda] = useState("");

  async function cargarCategorias() {
    const { data, error } = await supabase
      .from("categorias")
      .select(
        `id, nombre,
         atributos ( id, nombre, tipo, orden,
           atributo_opciones ( id, valor ) )`
      )
      .order("nombre");
    if (!error) setCategorias(data);
  }

  async function cargarEquipos() {
    setLoading(true);
    const { data, error } = await supabase
      .from("equipos")
      .select(
        `id, codigo, informacion, estado, disponibilidad, fecha_adquisicion, categoria_id,
         categorias ( nombre ),
         equipo_atributos ( atributo_id, valor_texto, opcion_id )`
      )
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
    } else {
      setEquipos(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarCategorias();
    cargarEquipos();
  }, []);

  async function eliminarEquipo(id) {
    if (!confirm("¿Eliminar este equipo del inventario?")) return;
    const { error } = await supabase.from("equipos").delete().eq("id", id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    cargarEquipos();
  }

  async function cambiarDisponibilidad(equipo, nueva) {
    const { error } = await supabase
      .from("equipos")
      .update({ disponibilidad: nueva })
      .eq("id", equipo.id);
    if (error) {
      alert("No se pudo actualizar: " + error.message);
      return;
    }
    cargarEquipos();
  }

  const equiposFiltrados = equipos.filter((eq) => {
    if (filtroCategoria && String(eq.categoria_id) !== filtroCategoria) return false;
    if (filtroDisponibilidad && eq.disponibilidad !== filtroDisponibilidad) return false;
    if (busqueda) {
      const texto = `${eq.codigo} ${eq.informacion ?? ""}`.toLowerCase();
      if (!texto.includes(busqueda.toLowerCase())) return false;
    }
    return true;
  });

  return (
    <>
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-eyebrow">INVENTARIO</span>
          <h1>Equipos</h1>
          <p>Gestiona el inventario completo de equipo de sonido.</p>
        </div>
        <div className="header-actions">
          <button
            className="add-button"
            onClick={() => {
              setEditingEquipo(null);
              setShowForm(true);
            }}
          >
            + Agregar equipo
          </button>
        </div>
      </header>

      <div className="dashboard-card filtros-bar">
        <input
          type="text"
          placeholder="Buscar por código o información..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />

        <select value={filtroCategoria} onChange={(e) => setFiltroCategoria(e.target.value)}>
          <option value="">Todas las categorías</option>
          {categorias.map((c) => (
            <option key={c.id} value={c.id}>{c.nombre}</option>
          ))}
        </select>

        <select
          value={filtroDisponibilidad}
          onChange={(e) => setFiltroDisponibilidad(e.target.value)}
        >
          <option value="">Cualquier disponibilidad</option>
          <option value="disponible">Disponible</option>
          <option value="alquilado">Alquilado</option>
          <option value="mantenimiento">Mantenimiento</option>
        </select>
      </div>

      {showForm && (
        <EquipoForm
          categorias={categorias}
          initialEquipo={editingEquipo}
          onCancel={() => setShowForm(false)}
          onSaved={() => {
            setShowForm(false);
            cargarEquipos();
          }}
        />
      )}

      {loading ? (
        <p>Cargando inventario...</p>
      ) : (
        <div className="equipos-tabla dashboard-card">
          {equiposFiltrados.length === 0 && <p>No hay equipos que coincidan.</p>}

          {equiposFiltrados.map((eq) => (
            <div className="equipo-fila" key={eq.id}>
              <div className="equipo-fila-info">
                <strong>{eq.codigo}</strong>
                <span>{eq.informacion || "—"}</span>
                <small>{eq.categorias?.nombre}</small>
              </div>

              <span className={`estado-badge estado-${eq.estado}`}>{eq.estado}</span>

              <span className={`status ${
                eq.disponibilidad === "disponible" ? "available" : "maintenance"
              }`}>
                {eq.disponibilidad}
              </span>

              <div className="equipo-fila-acciones">
                {eq.disponibilidad !== "alquilado" && (
                  <button
                    onClick={() =>
                      cambiarDisponibilidad(
                        eq,
                        eq.disponibilidad === "mantenimiento" ? "disponible" : "mantenimiento"
                      )
                    }
                  >
                    {eq.disponibilidad === "mantenimiento" ? "Marcar disponible" : "A mantenimiento"}
                  </button>
                )}
                <button
                  onClick={() => {
                    setEditingEquipo(eq);
                    setShowForm(true);
                  }}
                >
                  Editar
                </button>
                <button className="equipo-eliminar" onClick={() => eliminarEquipo(eq.id)}>
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

function EquipoForm({ categorias, initialEquipo, onCancel, onSaved }) {
  const esEdicion = Boolean(initialEquipo);

  const [codigo, setCodigo] = useState(initialEquipo?.codigo ?? "");
  const [informacion, setInformacion] = useState(initialEquipo?.informacion ?? "");
  const [categoriaId, setCategoriaId] = useState(
    initialEquipo ? String(initialEquipo.categoria_id) : ""
  );
  const [estado, setEstado] = useState(initialEquipo?.estado ?? "bueno");
  const [disponibilidad, setDisponibilidad] = useState(
    initialEquipo?.disponibilidad ?? "disponible"
  );
  const [fechaAdquisicion, setFechaAdquisicion] = useState(
    initialEquipo?.fecha_adquisicion ?? ""
  );
  const [valoresAtributos, setValoresAtributos] = useState(() => {
    const inicial = {};
    if (initialEquipo?.equipo_atributos) {
      for (const val of initialEquipo.equipo_atributos) {
        inicial[val.atributo_id] = val.valor_texto ?? String(val.opcion_id ?? "");
      }
    }
    return inicial;
  });
  const [guardando, setGuardando] = useState(false);

  const categoriaSeleccionada = categorias.find((c) => String(c.id) === categoriaId);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!codigo.trim() || !categoriaId) {
      alert("Código y categoría son obligatorios.");
      return;
    }

    setGuardando(true);

    const payload = {
      codigo: codigo.trim(),
      informacion: informacion.trim() || null,
      categoria_id: Number(categoriaId),
      estado,
      disponibilidad,
      fecha_adquisicion: fechaAdquisicion || null,
    };

    let equipoId = initialEquipo?.id;

    if (esEdicion) {
      const { error } = await supabase.from("equipos").update(payload).eq("id", equipoId);
      if (error) {
        alert("No se pudo actualizar: " + error.message);
        setGuardando(false);
        return;
      }
      // Reemplazamos los atributos: borramos y volvemos a insertar los que tengan valor
      await supabase.from("equipo_atributos").delete().eq("equipo_id", equipoId);
    } else {
      const { data, error } = await supabase
        .from("equipos")
        .insert(payload)
        .select()
        .single();
      if (error) {
        alert("No se pudo crear: " + error.message);
        setGuardando(false);
        return;
      }
      equipoId = data.id;
    }

    if (categoriaSeleccionada) {
      const filas = [];
      for (const atributo of categoriaSeleccionada.atributos) {
        const valor = valoresAtributos[atributo.id];
        if (!valor) continue;

        if (atributo.tipo === "texto") {
          filas.push({ equipo_id: equipoId, atributo_id: atributo.id, valor_texto: valor });
        } else {
          filas.push({ equipo_id: equipoId, atributo_id: atributo.id, opcion_id: Number(valor) });
        }
      }

      if (filas.length > 0) {
        const { error } = await supabase.from("equipo_atributos").insert(filas);
        if (error) {
          alert("El equipo se guardó, pero hubo un error con sus atributos: " + error.message);
        }
      }
    }

    setGuardando(false);
    onSaved();
  }

  return (
    <form className="dashboard-card equipo-form" onSubmit={handleSubmit}>
      <h2>{esEdicion ? "Editar equipo" : "Agregar equipo"}</h2>

      <div className="equipo-form-grid">
        <label>
          Código
          <input value={codigo} onChange={(e) => setCodigo(e.target.value)} required />
        </label>

        <label>
          Información
          <input value={informacion} onChange={(e) => setInformacion(e.target.value)} />
        </label>

        <label>
          Categoría
          <select
            value={categoriaId}
            onChange={(e) => {
              setCategoriaId(e.target.value);
              setValoresAtributos({});
            }}
            required
          >
            <option value="">Selecciona...</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.id}>{c.nombre}</option>
            ))}
          </select>
        </label>

        <label>
          Estado
          <select value={estado} onChange={(e) => setEstado(e.target.value)}>
            {ESTADOS.map((e) => (
              <option key={e} value={e}>{e}</option>
            ))}
          </select>
        </label>

        <label>
          Disponibilidad
          <select value={disponibilidad} onChange={(e) => setDisponibilidad(e.target.value)}>
            <option value="disponible">Disponible</option>
            <option value="mantenimiento">Mantenimiento</option>
          </select>
        </label>

        <label>
          Fecha de adquisición
          <input
            type="date"
            value={fechaAdquisicion ?? ""}
            onChange={(e) => setFechaAdquisicion(e.target.value)}
          />
        </label>
      </div>

      {categoriaSeleccionada && categoriaSeleccionada.atributos.length > 0 && (
        <>
          <h3>Atributos de {categoriaSeleccionada.nombre}</h3>
          <div className="equipo-form-grid">
            {categoriaSeleccionada.atributos.map((atributo) => (
              <label key={atributo.id}>
                {atributo.nombre}
                {atributo.tipo === "texto" ? (
                  <input
                    value={valoresAtributos[atributo.id] ?? ""}
                    onChange={(e) =>
                      setValoresAtributos({ ...valoresAtributos, [atributo.id]: e.target.value })
                    }
                  />
                ) : (
                  <select
                    value={valoresAtributos[atributo.id] ?? ""}
                    onChange={(e) =>
                      setValoresAtributos({ ...valoresAtributos, [atributo.id]: e.target.value })
                    }
                  >
                    <option value="">Selecciona...</option>
                    {atributo.atributo_opciones.map((op) => (
                      <option key={op.id} value={op.id}>{op.valor}</option>
                    ))}
                  </select>
                )}
              </label>
            ))}
          </div>
        </>
      )}

      <div className="equipo-form-acciones">
        <button type="button" onClick={onCancel} disabled={guardando}>Cancelar</button>
        <button type="submit" className="add-button" disabled={guardando}>
          {guardando ? "Guardando..." : "Guardar"}
        </button>
      </div>
    </form>
  );
}