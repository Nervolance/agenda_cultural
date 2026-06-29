import type { Evento } from "./types";
import { MESES, DIAS_SEM } from "./constants";

export function hashId(e: Pick<Evento, "nombre" | "fecha" | "sala">): string {
  const base = `${(e.nombre || "").toLowerCase()}|${e.fecha || ""}|${(e.sala || "").toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    h = (h << 5) - h + base.charCodeAt(i);
    h |= 0;
  }
  return "ev" + Math.abs(h).toString(36);
}

export function extraerJSON(texto: string): Evento[] | null {
  if (!texto) return null;
  const limpio = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const ini = limpio.indexOf("[");
  const fin = limpio.lastIndexOf("]");
  if (ini === -1 || fin === -1 || fin <= ini) return null;
  try {
    return JSON.parse(limpio.slice(ini, fin + 1));
  } catch {
    return null;
  }
}

export function formatearFecha(iso: string): string {
  if (!iso) return "Fecha por confirmar";
  const d = new Date(iso + "T00:00:00");
  const diaSem = DIAS_SEM[(d.getDay() + 6) % 7];
  return `${diaSem} ${d.getDate()} ${MESES[d.getMonth()]} ${d.getFullYear()}`;
}

export function googleCalUrl(e: Evento): string | null {
  if (!e.fecha) return null;
  const inicio = e.hora ? `${e.fecha}T${e.hora}:00` : `${e.fecha}T00:00:00`;
  const fin = e.hora
    ? `${e.fecha}T${String(parseInt(e.hora.split(":")[0]) + 2).padStart(2, "0")}:00:00`
    : `${e.fecha}T23:59:59`;
  const titulo = encodeURIComponent(`${e.nombre} @ ${e.sala || e.ciudad}`);
  const desc = encodeURIComponent(`${e.sala || ""} ${e.ciudad || ""}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicio.replace(/[-:]/g, "")}/${fin.replace(/[-:]/g, "")}&details=${desc}`;
}
