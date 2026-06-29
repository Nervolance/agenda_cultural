import { useState, useEffect, useCallback, useRef } from "react";
import type { Evento } from "../types";
import { CREMA, CATEGORIAS, CATEGORIAS_LOCAL } from "../constants";
import { SYSTEM_PROMPT, SYSTEM_PROMPT_LOCAL } from "../prompts";
import { hashId, extraerJSON } from "../utils";
import Controles from "./Controles";
import CalendarioView from "./CalendarioView";
import ListaView from "./ListaView";
import AgendaLocalView from "./AgendaLocalView";

const MODEL = "claude-sonnet-4-20250514";
const API_URL = "/api/anthropic/v1/messages";
const WEB_SEARCH_TOOL = [{ type: "web_search_20250305", name: "web_search" }];

async function llamarAPI(system: string, userMsg: string): Promise<Evento[]> {
  const res = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 3000,
      system,
      messages: [{ role: "user", content: userMsg }],
      tools: WEB_SEARCH_TOOL,
    }),
  });
  if (!res.ok) throw new Error(`API error: ${res.status}`);
  const data = await res.json();
  for (const block of data.content || []) {
    if (block.type === "text") {
      const parsed = extraerJSON(block.text);
      if (Array.isArray(parsed)) return parsed;
    }
  }
  return [];
}

export default function AgendaCultural() {
  // --- Main search ---
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [cargando, setCargando] = useState(false);
  const [novedades, setNovedades] = useState<string[]>([]);
  const [novedadesSet, setNovedadesSet] = useState<Set<string>>(new Set());
  const eventosRef = useRef<Evento[]>([]);

  // --- View ---
  const [vista, setVista] = useState("calendario");
  const [diaSel, setDiaSel] = useState<string | null>(null);
  const [eventoSel, setEventoSel] = useState<Evento | null>(null);

  // --- Main filters ---
  const [afinidadFil, setAfinidadFil] = useState<Set<string>>(new Set(["verde", "amarillo", "rojo"]));
  const [categoriaFil, setCategoriaFil] = useState<Set<string>>(new Set(CATEGORIAS));

  // --- Agenda Local (completely independent) ---
  const [eventosLocales, setEventosLocales] = useState<Evento[]>([]);
  const [cargandoLocal, setCargandoLocal] = useState(false);
  const [categoriaFilLocal, setCategoriaFilLocal] = useState<Set<string>>(new Set(CATEGORIAS_LOCAL));

  const buscar = useCallback(async () => {
    setCargando(true);
    try {
      const raw = await llamarAPI(SYSTEM_PROMPT, "Busca eventos culturales de los próximos 2-3 meses en Vigo, Galicia y norte de Portugal según mi perfil.");
      const conId = raw.map((e) => ({ ...e, id: hashId(e) }));
      const prevIds = new Set(eventosRef.current.map((e) => e.id));
      const nuevosIds = conId.filter((e) => !prevIds.has(e.id)).map((e) => e.id);
      eventosRef.current = conId;
      setEventos(conId);
      setNovedades(nuevosIds);
      setNovedadesSet(new Set(nuevosIds));
    } catch (err) {
      console.error(err);
      alert("Error al buscar eventos. Verifica tu API key.");
    } finally {
      setCargando(false);
    }
  }, []);

  const buscarLocal = useCallback(async () => {
    setCargandoLocal(true);
    try {
      const raw = await llamarAPI(SYSTEM_PROMPT_LOCAL, "Busca todos los eventos culturales en Vigo y alrededores para los próximos 7-14 días.");
      setEventosLocales(raw.map((e) => ({ ...e, id: hashId(e) })));
    } catch (err) {
      console.error(err);
      alert("Error al buscar eventos locales. Verifica tu API key.");
    } finally {
      setCargandoLocal(false);
    }
  }, []);

  useEffect(() => { buscar(); }, [buscar]);

  const visibles = eventos.filter((e) => afinidadFil.has(e.afinidad) && categoriaFil.has(e.categoria));
  const quitarEvento = (id: string) => setEventos((prev) => prev.filter((e) => e.id !== id));

  return (
    <div style={{ minHeight: "100vh", background: CREMA, padding: 20, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>

        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 6, color: "#2a2420" }}>
            Agenda Cultural de Rodrigo
          </h1>
          <p style={{ color: "#6b635a", margin: 0, fontSize: 14 }}>Vigo, Galicia — Próximos eventos</p>
        </div>

        <Controles
          vista={vista} setVista={setVista}
          cargando={cargando} buscar={buscar}
          cargandoLocal={cargandoLocal} buscarLocal={buscarLocal}
          afinidadFil={afinidadFil} setAfinidadFil={setAfinidadFil}
          categoriaFil={categoriaFil} setCategoriaFil={setCategoriaFil}
          categoriaFilLocal={categoriaFilLocal} setCategoriaFilLocal={setCategoriaFilLocal}
        />

        {novedades.length > 0 && (
          <div style={{ background: "#5a7d4f", color: "#fff", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, textAlign: "center" }}>
            ✨ {novedades.length} evento(s) nuevo(s) desde la última búsqueda
          </div>
        )}

        {eventos.length === 0 && !cargando && vista !== "local" && (
          <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px" }}>
            <p>No hay eventos aún. Haz clic en "Buscar" para empezar.</p>
          </div>
        )}

        {vista === "calendario" && eventos.length > 0 && (
          <CalendarioView
            visibles={visibles} novedadesSet={novedadesSet}
            diaSel={diaSel} setDiaSel={setDiaSel}
            eventoSel={eventoSel} setEventoSel={setEventoSel}
            quitarEvento={quitarEvento}
          />
        )}

        {vista === "lista" && eventos.length > 0 && (
          <ListaView visibles={visibles} novedadesSet={novedadesSet} quitarEvento={quitarEvento} />
        )}

        {vista === "local" && (
          <AgendaLocalView
            eventosLocales={eventosLocales} cargandoLocal={cargandoLocal}
            categoriaFilLocal={categoriaFilLocal} setEventosLocales={setEventosLocales}
          />
        )}
      </div>
    </div>
  );
}
