import type { Evento } from "../types";
import { MESES, DIAS_SEM, COLOR_AFINIDAD, ICONO_CAT, ETIQUETA_AFINIDAD, ACENTO } from "../constants";
import { formatearFecha } from "../utils";
import TarjetaEvento from "./TarjetaEvento";

interface Props {
  visibles: Evento[];
  novedadesSet: Set<string>;
  diaSel: string | null;
  setDiaSel: (d: string | null) => void;
  eventoSel: Evento | null;
  setEventoSel: (e: Evento | null) => void;
  quitarEvento: (id: string) => void;
}

interface DiaCelda {
  fecha: string;
  dia: number;
  mesActual: boolean;
  esHoy: boolean;
}

function buildGrid(): DiaCelda[] {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const primerDia = new Date(añoActual, mesActual, 1);
  const diasDelMes = new Date(añoActual, mesActual + 1, 0).getDate();
  const diasAnteriores = (primerDia.getDay() + 6) % 7; // Monday-first
  const hoyStr = hoy.toISOString().split("T")[0];

  const dias: DiaCelda[] = [];
  for (let i = -diasAnteriores; i < diasDelMes; i++) {
    const fecha = new Date(primerDia);
    fecha.setDate(fecha.getDate() + i);
    const fechaStr = fecha.toISOString().split("T")[0];
    dias.push({
      fecha: fechaStr,
      dia: fecha.getDate(),
      mesActual: fecha.getMonth() === mesActual,
      esHoy: fechaStr === hoyStr,
    });
  }
  return dias;
}

export default function CalendarioView({ visibles, novedadesSet, diaSel, setDiaSel, eventoSel, setEventoSel, quitarEvento }: Props) {
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const dias = buildGrid();

  const detalle = diaSel
    ? visibles.filter((e) => e.fecha === diaSel)
    : eventoSel
      ? [eventoSel]
      : visibles.slice(0, 5);

  const tituloDetalle = diaSel ? `Eventos del ${formatearFecha(diaSel)}` : "Próximos eventos";

  return (
    <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(60,50,40,0.06)" }}>
      <h2 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 600, margin: "0 0 16px", textTransform: "capitalize" }}>
        {MESES[mesActual]} {añoActual}
      </h2>

      {/* Day headers */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 16 }}>
        {DIAS_SEM.map((d) => (
          <div key={d} style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: "#a59a8d", textTransform: "uppercase", marginBottom: 8 }}>
            {d}
          </div>
        ))}

        {dias.map((c) => {
          const evs = visibles.filter((e) => e.fecha === c.fecha);
          const sel = c.fecha === diaSel;
          return (
            <div
              key={c.fecha}
              onClick={() => { if (evs.length) { setDiaSel(c.fecha); setEventoSel(null); } }}
              style={{
                minHeight: 72,
                background: c.mesActual ? "#fff" : "#f6f3ed",
                borderRadius: 8,
                border: sel ? `2px solid ${ACENTO}` : c.esHoy ? "2px solid #d8c4a6" : "1px solid #ece7df",
                padding: 4,
                cursor: evs.length ? "pointer" : "default",
                opacity: c.mesActual ? 1 : 0.55,
                overflow: "hidden",
              }}
            >
              <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11.5, textAlign: "right", color: c.esHoy ? ACENTO : "#9a9088", fontWeight: c.esHoy ? 600 : 400, padding: "1px 3px" }}>
                {c.dia}
              </div>
              {evs.slice(0, 2).map((e) => (
                <div
                  key={e.id}
                  onClick={(ev) => { ev.stopPropagation(); setEventoSel(e); setDiaSel(c.fecha); }}
                  title={e.nombre}
                  style={{
                    background: COLOR_AFINIDAD[e.afinidad] || "#999",
                    color: "#fff", borderRadius: 4, fontSize: 9.5,
                    padding: "2px 4px", marginTop: 2,
                    whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", lineHeight: 1.3,
                  }}
                >
                  {novedadesSet.has(e.id) ? "🆕 " : ""}
                  {ICONO_CAT[e.categoria]} {e.nombre}
                </div>
              ))}
              {evs.length > 2 && (
                <div style={{ fontSize: 9.5, color: "#998f82", marginTop: 2, paddingLeft: 3, fontFamily: "'DM Mono', monospace" }}>
                  +{evs.length - 2} más
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
        {["verde", "amarillo", "rojo"].map((a) => (
          <span key={a} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6b635a", fontFamily: "'DM Mono', monospace" }}>
            <span style={{ width: 11, height: 11, borderRadius: 3, background: COLOR_AFINIDAD[a], display: "inline-block" }} />
            {ETIQUETA_AFINIDAD[a]}
          </span>
        ))}
      </div>

      {/* Detail panel */}
      {detalle.length > 0 && (
        <div style={{ marginTop: 18 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
            <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 600, margin: 0, textTransform: "capitalize" }}>
              {eventoSel ? "Evento seleccionado" : tituloDetalle}
            </h3>
            <button
              onClick={() => { setDiaSel(null); setEventoSel(null); }}
              style={{ background: "none", border: "none", color: ACENTO, cursor: "pointer", fontSize: 13 }}
            >
              cerrar ✕
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {detalle.map((e) => (
              <TarjetaEvento key={e.id} e={e} esNuevo={novedadesSet.has(e.id)} onQuitar={() => quitarEvento(e.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
