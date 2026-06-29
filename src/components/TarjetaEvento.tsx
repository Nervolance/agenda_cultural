import type { Evento } from "../types";
import { COLOR_AFINIDAD, ICONO_CAT, ETIQUETA_DIST, BANDERA, ACENTO } from "../constants";
import { googleCalUrl } from "../utils";

interface Props {
  e: Evento;
  onQuitar: () => void;
  esNuevo: boolean;
}

export default function TarjetaEvento({ e, onQuitar, esNuevo }: Props) {
  const color = COLOR_AFINIDAD[e.afinidad] || "#6a8a7a";

  return (
    <article
      style={{
        background: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        boxShadow: "0 1px 4px rgba(60,50,40,0.08)",
        border: "1px solid #ece7df",
        position: "relative",
      }}
    >
      <div style={{ height: 3, background: color }} />

      <button
        onClick={onQuitar}
        title="Quitar de la agenda"
        style={{
          position: "absolute", top: 12, right: 12,
          width: 26, height: 26, borderRadius: "50%",
          border: "none", background: "#f3efe8", color: "#998f82",
          cursor: "pointer", fontSize: 15, lineHeight: 1,
        }}
      >
        ×
      </button>

      <div style={{ padding: "16px 18px" }}>
        <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8, flexWrap: "wrap" }}>
          <span style={{ fontSize: 16 }}>{ICONO_CAT[e.categoria] || "✨"}</span>
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, letterSpacing: 1, color, textTransform: "uppercase", fontWeight: 500 }}>
            {e.categoria}
          </span>
          {e.distancia && (
            <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: "#b0a698" }}>
              · {ETIQUETA_DIST[e.distancia] || ""}
            </span>
          )}
          {esNuevo && (
            <span style={{ background: "#5a7d4f", color: "#fff", fontSize: 9.5, fontWeight: 700, borderRadius: 4, padding: "2px 6px", letterSpacing: 0.5 }}>
              NUEVO
            </span>
          )}
        </div>

        <h3 style={{ fontFamily: "'Lora', serif", fontSize: 20, fontWeight: 600, margin: "0 0 8px", paddingRight: 24, lineHeight: 1.2 }}>
          {e.nombre}
        </h3>

        <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 12.5, color: "#5a5249", lineHeight: 1.7 }}>
          <div style={{ textTransform: "capitalize" }}>
            📅 {new Date(e.fecha).toLocaleDateString("es-ES", { weekday: "short", year: "numeric", month: "long", day: "numeric" })}
            {e.hora ? ` · ${e.hora}` : ""}
          </div>
          <div>
            📍 {e.sala}{e.sala && e.ciudad ? " · " : ""}{e.ciudad} {BANDERA[e.pais] || ""}
          </div>
          {e.precio && <div>🎟️ {e.precio}</div>}
        </div>

        {e.razon && (
          <p style={{ fontSize: 13.5, color: "#6b635a", fontStyle: "italic", margin: "10px 0 0", lineHeight: 1.5, borderLeft: `2px solid ${color}`, paddingLeft: 10 }}>
            {e.razon}
          </p>
        )}

        <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          {e.enlace && (
            <a href={e.enlace} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: ACENTO, textDecoration: "none", fontWeight: 600 }}>
              Entradas / info →
            </a>
          )}
          {googleCalUrl(e) && (
            <a href={googleCalUrl(e)!} target="_blank" rel="noopener noreferrer"
              style={{ fontSize: 13, color: "#3367d6", textDecoration: "none", fontWeight: 600 }}>
              📅 Añadir a Google Calendar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
