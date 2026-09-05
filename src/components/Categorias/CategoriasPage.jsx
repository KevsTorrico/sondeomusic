import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import "../menu/Dashboard.css";
import "./CategoriasPage.css";

export default function CategoriasPage() {
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [nuevaCategoria, setNuevaCategoria] = useState("");

  async function cargarCategorias() {
    setLoading(true);
    const { data, error } = await supabase
      .from("categorias")
      .select(
        `id, nombre,
         atributos ( id, nombre, tipo, orden,
           atributo_opciones ( id, valor, orden ) )`
      )
      .order("nombre");

    if (error) {
      console.error(error);
    } else {
      setCategorias(data);
    }
    setLoading(false);
  }

  useEffect(() => {
    cargarCategorias();
  }, []);

  async function agregarCategoria(e) {
    e.preventDefault();
    if (!nuevaCategoria.trim()) return;

    const { error } = await supabase
      .from("categorias")
      .insert({ nombre: nuevaCategoria.trim() });

    if (error) {
      alert("No se pudo crear la categoría: " + error.message);
      return;
    }
    setNuevaCategoria("");
    cargarCategorias();
  }

  async function eliminarCategoria(id) {
    if (!confirm("¿Eliminar esta categoría? También se borrarán sus atributos.")) return;

    const { error } = await supabase.from("categorias").delete().eq("id", id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    cargarCategorias();
  }

  return (
    <>
      <header className="dashboard-header">
        <div className="header-title">
          <span className="header-eyebrow">ADMINISTRACIÓN</span>
          <h1>Categorías y atributos</h1>
          <p>Define las categorías de equipo y qué campos tiene cada una.</p>
        </div>
      </header>

      <div className="dashboard-card">
        <form className="categoria-form" onSubmit={agregarCategoria}>
          <input
            type="text"
            placeholder="Nombre de la nueva categoría"
            value={nuevaCategoria}
            onChange={(e) => setNuevaCategoria(e.target.value)}
          />
          <button type="submit" className="add-button">+ Agregar categoría</button>
        </form>
      </div>

      {loading ? (
        <p>Cargando categorías...</p>
      ) : (
        <div className="categoria-list">
          {categorias.map((categoria) => (
            <CategoriaItem
              key={categoria.id}
              categoria={categoria}
              expanded={expandedId === categoria.id}
              onToggle={() =>
                setExpandedId(expandedId === categoria.id ? null : categoria.id)
              }
              onDelete={() => eliminarCategoria(categoria.id)}
              onChanged={cargarCategorias}
            />
          ))}
        </div>
      )}
    </>
  );
}

function CategoriaItem({ categoria, expanded, onToggle, onDelete, onChanged }) {
  const [nombreAtributo, setNombreAtributo] = useState("");
  const [tipoAtributo, setTipoAtributo] = useState("texto");

  async function agregarAtributo(e) {
    e.preventDefault();
    if (!nombreAtributo.trim()) return;

    const { error } = await supabase.from("atributos").insert({
      categoria_id: categoria.id,
      nombre: nombreAtributo.trim(),
      tipo: tipoAtributo,
    });

    if (error) {
      alert("No se pudo crear el atributo: " + error.message);
      return;
    }
    setNombreAtributo("");
    onChanged();
  }

  async function eliminarAtributo(id) {
    if (!confirm("¿Eliminar este atributo?")) return;
    const { error } = await supabase.from("atributos").delete().eq("id", id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    onChanged();
  }

  return (
    <div className="dashboard-card categoria-item">
      <button className="categoria-header" onClick={onToggle}>
        <span>{categoria.nombre}</span>
        <span className="categoria-count">
          {categoria.atributos.length} atributo(s)
        </span>
        <span className="categoria-caret">{expanded ? "▾" : "▸"}</span>
      </button>

      {expanded && (
        <div className="categoria-body">
          {categoria.atributos.map((atributo) => (
            <AtributoItem
              key={atributo.id}
              atributo={atributo}
              onDelete={() => eliminarAtributo(atributo.id)}
              onChanged={onChanged}
            />
          ))}

          <form className="atributo-form" onSubmit={agregarAtributo}>
            <input
              type="text"
              placeholder="Nombre del atributo (ej. Patrón Polar)"
              value={nombreAtributo}
              onChange={(e) => setNombreAtributo(e.target.value)}
            />
            <select
              value={tipoAtributo}
              onChange={(e) => setTipoAtributo(e.target.value)}
            >
              <option value="texto">Texto libre</option>
              <option value="lista">Lista desplegable</option>
            </select>
            <button type="submit" className="add-button">+ Agregar</button>
          </form>

          <button className="categoria-delete" onClick={onDelete}>
            Eliminar esta categoría
          </button>
        </div>
      )}
    </div>
  );
}

function AtributoItem({ atributo, onDelete, onChanged }) {
  const [nuevaOpcion, setNuevaOpcion] = useState("");

  async function agregarOpcion(e) {
    e.preventDefault();
    if (!nuevaOpcion.trim()) return;

    const { error } = await supabase.from("atributo_opciones").insert({
      atributo_id: atributo.id,
      valor: nuevaOpcion.trim(),
    });

    if (error) {
      alert("No se pudo crear la opción: " + error.message);
      return;
    }
    setNuevaOpcion("");
    onChanged();
  }

  async function eliminarOpcion(id) {
    const { error } = await supabase.from("atributo_opciones").delete().eq("id", id);
    if (error) {
      alert("No se pudo eliminar: " + error.message);
      return;
    }
    onChanged();
  }

  return (
    <div className="atributo-item">
      <div className="atributo-info">
        <strong>{atributo.nombre}</strong>
        <span className={`tipo-badge tipo-${atributo.tipo}`}>
          {atributo.tipo === "lista" ? "Lista" : "Texto"}
        </span>
      </div>

      {atributo.tipo === "lista" && (
        <div className="opciones-box">
          <div className="opciones-chips">
            {atributo.atributo_opciones.map((op) => (
              <span className="opcion-chip" key={op.id}>
                {op.valor}
                <button onClick={() => eliminarOpcion(op.id)}>×</button>
              </span>
            ))}
          </div>

          <form className="opcion-form" onSubmit={agregarOpcion}>
            <input
              type="text"
              placeholder="Nueva opción"
              value={nuevaOpcion}
              onChange={(e) => setNuevaOpcion(e.target.value)}
            />
            <button type="submit">+</button>
          </form>
        </div>
      )}

      <button className="atributo-delete" onClick={onDelete}>
        Eliminar
      </button>
    </div>
  );
}