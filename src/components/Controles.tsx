import type { Evento } from "../types";
import { ACENTO, COLOR_AFINIDAD, ETIQUETA_AFINIDAD, CATEGORIAS, CATEGORIAS_LOCAL, ICONO_CAT } from "../constants";

interface Props {
  vista: string;
  setVista: (v: string) => void;
  cargando: boolean;
  buscar: () => void;
  cargandoLocal: boolean;
  buscarLocal: () => void;
  afinidadFil: Set<string>;
  setAfinidadFil: (s: Set<string>) => void;
  categoriaFil: Set<string>;
  setCategoriaFil: (s: Set<string>) => void;
  categoriaFilLocal: Set<string>;
  setCategoriaFilLocal: (s: Set<string>) => void;
}

// --- Subcomponents (only used here) ---

function Fila({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#a59a8d", textTransform: "uppercase", marginBottom: 6 }}>
        {titulo}
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function Chip({ activo, onClick, children, color }: { activo: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      onClick={onClick}
      style={{
        border: `1px solid ${activo ? color || ACENTO : "#d8d2c8"}`,
        background: activo ? color || ACENTO : "#fff",
        color: activo ? "#fff" : "#5a5249",
        borderRadius: 20,
        padding: "5px 13px",
        fontSize: 12.5,
        cursor: "pointer",
        textTransform: "capitalize",
      }}
    >
      {children}
    </button>
  );
}

function toggleSet(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

// --- Tab button helper ---

function TabBtn({ label, active, onClick, activeColor }: { label: string; active: boolean; onClick: () => void; activeColor?: string }) {
  const bg = activeColor || ACENTO;
  return (
    <button
      onClick={onClick}
      style={{
        padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500, cursor: "pointer",
        border: active ? `2px solid ${bg}` : "1px solid #d8d2c8",
        background: active ? bg : "#fff",
        color: active ? "#fff" : "#5a5249",
      }}
    >
      {label}
    </button>
  );
}

// --- Main export ---

export default function Controles({
  vista, setVista,
  cargando, buscar,
  cargandoLocal, buscarLocal,
  afinidadFil, setAfinidadFil,
  categoriaFil, setCategoriaFil,
  categoriaFilLocal, setCategoriaFilLocal,
}: Props) {
  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 24, boxShadow: "0 1px 3px rgba(60,50,40,0.06)" }}>
      {/* Tabs + buscar */}
      <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
        <TabBtn label="📅 Calendario"   active={vista === "calendario"} onClick={() => setVista("calendario")} />
        <TabBtn label="📋 Lista"        active={vista === "lista"}      onClick={() => setVista("lista")} />
        <TabBtn label="🗺️ Mapa"        active={vista === "mapa"}       onClick={() => setVista("mapa")} />
        <TabBtn label="📍 Agenda Local" active={vista === "local"}      onClick={() => setVista("local")} activeColor="#4a7a5a" />

        {vista !== "local" && vista !== "mapa" ? (
          <button
            onClick={buscar} disabled={cargando}
            style={{
              padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: `1px solid ${cargando ? "#d8d2c8" : ACENTO}`,
              background: cargando ? "#f0eee9" : ACENTO,
              color: cargando ? "#9a9088" : "#fff",
              cursor: cargando ? "default" : "pointer",
            }}
          >
            {cargando ? "Buscando..." : "🔄 Buscar"}
          </button>
        ) : (
          <button
            onClick={buscarLocal} disabled={cargandoLocal}
            style={{
              padding: "8px 14px", borderRadius: 6, fontSize: 13, fontWeight: 500,
              border: `1px solid ${cargandoLocal ? "#d8d2c8" : "#4a7a5a"}`,
              background: cargandoLocal ? "#f0eee9" : "#4a7a5a",
              color: cargandoLocal ? "#9a9088" : "#fff",
              cursor: cargandoLocal ? "default" : "pointer",
            }}
          >
            {cargandoLocal ? "Buscando..." : "📍 Buscar Agenda Local"}
          </button>
        )}
      </div>

      {/* Filters — main search (hidden in mapa and local views) */}
      {vista !== "local" && vista !== "mapa" && (
        <>
          <Fila titulo="Afinidad">
            {["verde", "amarillo", "rojo"].map((a) => (
              <Chip key={a} activo={afinidadFil.has(a)} color={COLOR_AFINIDAD[a]} onClick={() => setAfinidadFil(toggleSet(afinidadFil, a))}>
                {ETIQUETA_AFINIDAD[a]}
              </Chip>
            ))}
          </Fila>
          <Fila titulo="Categoría">
            {CATEGORIAS.map((c) => (
              <Chip key={c} activo={categoriaFil.has(c)} onClick={() => setCategoriaFil(toggleSet(categoriaFil, c))}>
                {ICONO_CAT[c]} {c}
              </Chip>
            ))}
          </Fila>
        </>
      )}

      {/* Filters — Agenda Local */}
      {vista === "local" && (
        <Fila titulo="Categoría">
          {CATEGORIAS_LOCAL.map((c) => (
            <Chip key={c} activo={categoriaFilLocal.has(c)} onClick={() => setCategoriaFilLocal(toggleSet(categoriaFilLocal, c))}>
              {ICONO_CAT[c]} {c}
            </Chip>
          ))}
        </Fila>
      )}
    </div>
  );
}
