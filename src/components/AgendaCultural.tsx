import { useState, useEffect, useCallback, useRef } from "react";

// ----------------------------------------------------------------------------
// PERFIL DE RODRIGO (embebido en el prompt de búsqueda)
// ----------------------------------------------------------------------------

const TOP_ARTISTAS = `Hermanos Gutiérrez, Ocie Elliott, World/Inferno Friendship Society, Yom, Kerala Dust, Tunng, Takeshi's Cashew, Kevin Morby, Cuervo Cuervo, Richard Houghten, El Búho, Nomadic, Abraham Cupeiro, Jake Xerxes Fussell, islandman, Roseaux, Quantic, Emilio José, Silvio Astier, Falk Schönfelder, Kevin Kaarl, BCUC, Xosé Lois Romero, Celestial Aeon Project, Khruangbin, Krishna Das, The Architect, Duo Stiehler/Lucaciu, Gitkin, Ignacio Maria Gomez, Aukai, Ezéchiel Pailhès, Passion Coco, AURORA, Chancha Via Circuito, Gyedu-Blay Ambolley, Sleaford Mods, Abou Diarra, The Trials of Cato, Honahlei, Yin Yin, Opez, Blend Mishkin, Degiheugi, Amadou & Mariam, L'Attirail, Ibu Selva, Barry Can't Swim, Nicola Cruz, Baba Stiltz, Bremer/McCoy, Gizmo Varillas, Cari Cari, Tinariwen, Jethro Tull, Kalabrese, Pupkulies & Rebecca, Ali Farka Touré, José González, Jon and Roy, the Garifuna Collective, Rivière Monk, Owiny Sigoma Band, Waldeck, Camel Power Club, Laurent Bardainne, Juan Wauters, Guts, Jean du Voyage, Fela Kuti, Maribou State, La Femme, Leifur James, Alela Diane, Fat Dog, Renaud Garcia-Fons, René Aubry, Kham Meslien, Baiuca, Kinnaris Quintet, Imarhan, Blundetto, Sona Jobarteh, Cameron Winter, Nick Mulvey, City of the Sun, Niklas Paschburg, ARTBAT, TAXI KEBAB, Boogie Belgique, Populous, Mop Mop, Sababa 5, Mama's Broke, Felix Laband, Melissa Laveaux, Nils Frahm, Shooglenifty, Savana Funk, King Coya, Derek Gripper, Calypso Rose, Mathias Duplessy, Chapelier Fou, Samba Touré, GoGo Penguin, Sangre de Muerdago, La Yegros, Lisa O'Neill, Ibrahim Maalouf, DakhaBrakha, Rone, Fakear, Blanco White, Leon Bridges, Califato ¾, L'Eclair, Tommy Guerrero, Viken Arman, Elisapie`;

const SEGUIDOS = `AURORA, Abraham Cupeiro, Aliboria, Baiuca, Barry Can't Swim, Bayonne, Bon Iver, Bonbon Vodou, Caamaño & Ameixeiras, Califato ¾, Cameron Winter, Catuxa Salom, DULZARO, El Búho, Elephant Revival, Fela Kuti, Gwenno Morgan, Hermanos Gutiérrez, Iwaro, Joy Orbison, Juan Wauters, Jungle, Kerala Dust, Kevin Kaarl, Kevin Morby, Khruangbin, King Gizzard & The Lizard Wizard, Krishna Das, Nicola Cruz, Ocie Elliott, Sangre de Muerdago, Sleaford Mods, Sylvan Esso, Takeshi's Cashew, Tarde a Todo, The Bug, The Heavy Heavy, The Oh Hellos, The Trials of Cato, Xurxo Fernandes, Yin Yin, Yom`;

const AFRICANOS_DIRECTO = `Mdou Moctar, Songhoy Blues, Fatoumata Diawara, Seckou Keita, Sons of Kemet, Oumou Sangaré`;

const HUMOR = `La Ruina, Pantomima Full, David Suárez, stand-up de calidad, humor absurdo`;

const SYSTEM_PROMPT = `Eres el asistente personal de agenda cultural de Rodrigo (Vigo, Galicia). Tu tarea: usar la herramienta de búsqueda web para encontrar EVENTOS CULTURALES REALES Y FUTUROS (a partir de hoy) relevantes para su perfil, y devolverlos como JSON.

== PERFIL MUSICAL ==
Artistas que SIGUE (máxima afinidad): ${SEGUIDOS}
Top artistas escuchados (alta afinidad): ${TOP_ARTISTAS}
Géneros: world music global, folk/indie folk, electrónica orgánica/downtempo, música gallega y tradicional, ambient/meditativo, psicodelia, klezmer.
Artistas africanos que SÍ le interesan EN DIRECTO (aunque los banee del algoritmo): ${AFRICANOS_DIRECTO}.

== PERFIL CINE/CULTURA ==
Series y cine de culto, sátira política (Sí Ministro, The Thick of It, Succession), cine de autor europeo (Sorrentino, Gaspar Noé), filosofía/consciencia/psicodelia/plantas medicinales/micología, animación con peso, documentales (Searching for Sugar Man, Fantastic Fungi, Hamilton's Pharmacopeia).
Humor/stand-up: ${HUMOR}.
Cines de Vigo: Multicines Norte, Ocine Premium Gran Vía, Yelmo Travesía, Cines Tamberlick.

== ÁMBITO GEOGRÁFICO Y DISTANCIA ==
- Vigo ciudad y Galicia entera -> distancia "local". SIEMPRE relevante.
- Norte de Portugal (Porto, Braga, Viana) -> distancia "cerca". SOLO música/festivales.
- Lisboa -> distancia "cerca". Solo alta afinidad musical.
- Madrid / Barcelona -> distancia "lejos". Solo artistas de muy alta afinidad.

== ESPACIOS DE VIGO (revisar TODOS exhaustivamente) ==
Revisa la programación de TODAS las salas y espacios culturales de Vigo, incluyendo (lista no exhaustiva):
Auditorio Mar de Vigo, Teatro Afundación (Afundación Vigo), Sala Sinatras, La Fábrica de Chocolate, Sala Master Club, Sala Contrabaixo, MARCO (Museo de Arte Contemporánea), Casa das Artes, Auditorio Municipal do Concello de Vigo, Pazo de Congresos, Sala Salason (Cangas), Clavicémbalo, Multicines Norte, Cineclube de Vigo, Verbum, Castelo de San Sebastián, además de cualquier otra sala, pub musical, teatro o espacio cultural de la ciudad. Incluye también conciertos y festivales al aire libre en Vigo (Castrelos, etc.).

== FUENTES SUGERIDAS ==
Vigo: vigoe.es, Faro de Vigo agenda cultural, web del Concello de Vigo, webs propias de cada sala (Mar de Vigo, Afundación, Sinatras…), Cineclube de Vigo.
Galicia: Curtocircuíto (Santiago), OUFF (Ourense), FICBUEU (Bueu), Festival Noroeste (Coruña), PortAmérica (Catoira), Resurrection Fest (Viveiro), O Son do Camiño (Santiago).
Humor: teatros y salas de Vigo/Galicia con stand-up.

== CLASIFICACIÓN DE AFINIDAD ==
- "verde": artista que sigue o top escuchado, festival muy afín, cerca de Vigo.
- "amarillo": artista relacionado con sus gustos, interés medio, o artista top pero ciudad lejana.
- "rojo": afinidad baja o muy lejos, pero podría valer la pena.

== CATEGORÍAS ==
concierto / festival / cine / charla / humor / otro

== FORMATO DE SALIDA (OBLIGATORIO) ==
Tras buscar, responde ÚNICAMENTE con un array JSON válido, sin texto antes ni después, sin markdown ni \`\`\`. Cada evento:
{
  "nombre": "string",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM o vacío",
  "sala": "nombre del recinto",
  "ciudad": "ciudad",
  "pais": "España|Portugal",
  "precio": "ej. 15 € / Gratis / vacío",
  "enlace": "URL de entradas o info, o vacío",
  "categoria": "concierto|festival|cine|charla|humor|otro",
  "afinidad": "verde|amarillo|rojo",
  "distancia": "local|cerca|lejos",
  "razon": "1 frase corta: por qué le encaja a Rodrigo"
}
Prioriza eventos REALES verificados en la web, dando preferencia a los de Vigo ciudad. Entre 8 y 18 eventos. La fecha debe ser un día concreto (YYYY-MM-DD). Si no encuentras eventos reales, devuelve [].`;

// Constants
const ACENTO = "#7a4a10";
const CREMA = "#f0eee9";
const COLOR_AFINIDAD = { verde: "#5a7d4f", amarillo: "#c9962e", rojo: "#b15436" };
const ETIQUETA_AFINIDAD = { verde: "Muy afín", amarillo: "Interés medio", rojo: "Quizá" };
const BANDERA = { España: "🇪🇸", Portugal: "🇵🇹" };
const ETIQUETA_DIST = { local: "Cerca · Galicia", cerca: "Norte Portugal / Lisboa", lejos: "Lejos" };
const CATEGORIAS = ["concierto", "festival", "cine", "charla", "humor", "otro"];
const CATEGORIAS_LOCAL = ["concierto", "festival", "cine", "charla", "teatro", "expo", "mercadillo", "otro"];
const ICONO_CAT = { concierto: "🎵", festival: "🎪", cine: "🎬", charla: "🎙️", humor: "😄", otro: "✨", teatro: "🎭", expo: "🖼️", mercadillo: "🛒" };
const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
const DIAS_SEM = ["L", "M", "X", "J", "V", "S", "D"];

// Utilities
function hashId(e) {
  const base = `${(e.nombre || "").toLowerCase()}|${e.fecha || ""}|${(e.sala || "").toLowerCase()}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    h = (h << 5) - h + base.charCodeAt(i);
    h |= 0;
  }
  return "ev" + Math.abs(h).toString(36);
}

function extraerJSON(texto) {
  if (!texto) return null;
  let limpio = texto.replace(/```json/gi, "").replace(/```/g, "").trim();
  const ini = limpio.indexOf("[");
  const fin = limpio.lastIndexOf("]");
  if (ini === -1 || fin === -1 || fin <= ini) return null;
  try {
    return JSON.parse(limpio.slice(ini, fin + 1));
  } catch {
    return null;
  }
}

function formatearFecha(iso) {
  if (!iso) return "Fecha por confirmar";
  const d = new Date(iso + "T00:00:00");
  const dia = d.getDate();
  const mes = MESES[d.getMonth()];
  const año = d.getFullYear();
  const diaSem = DIAS_SEM[(d.getDay() + 6) % 7];
  return `${diaSem} ${dia} ${mes} ${año}`;
}

function googleCalUrl(e) {
  if (!e.fecha) return null;
  const inicio = e.hora ? `${e.fecha}T${e.hora}:00` : `${e.fecha}T00:00:00`;
  const fin = e.hora ? `${e.fecha}T${String(parseInt(e.hora.split(":")[0]) + 2).padStart(2, "0")}:00:00` : `${e.fecha}T23:59:59`;
  const titulo = encodeURIComponent(`${e.nombre} @ ${e.sala || e.ciudad}`);
  const desc = encodeURIComponent(`${e.sala || ""} ${e.ciudad || ""}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${titulo}&dates=${inicio.replace(/[-:]/g, "")}/${fin.replace(/[-:]/g, "")}&details=${desc}`;
}

const SYSTEM_PROMPT_LOCAL = `Eres un buscador de eventos locales de Vigo y alrededores. Tu tarea: usar la herramienta de búsqueda web para encontrar TODOS los eventos reales y próximos en Vigo, Pontevedra provincia y alrededores (próximos 7-14 días), sin ningún filtro de perfil personal.

== ÁMBITO GEOGRÁFICO ==
Primario: Vigo ciudad + Pontevedra provincia.
Secundario: Cangas, Redondela, Baiona, Marín, Moaña, Bajamar, Beade, Barro, Arcade.
Horizonte temporal: Hoy + próximos 7-14 días (NO meses).

== FUENTES OBLIGATORIAS ==
Busca exhaustivamente en TODAS estas fuentes:
1. hoxe.vigo.org — Agenda oficial de Vigo
2. viralagenda.com — Eventos Galicia
3. metropolitano.gal — Agenda Metropolitana de Vigo
4. lovingvigo.com — Eventos Vigo
5. Webs propias de espacios: Auditorio Mar de Vigo, Teatro Afundación, Sala Sinatras, La Fábrica de Chocolate, Master Club, Contrabaixo, MARCO, Casa das Artes, Castrelos

== QUÉ INCLUIR (TODO) ==
Conciertos y recitales (pequeños y grandes), festivales, cine (cineclub, estrenos), teatro, danza, charlas, exposiciones, ferias, mercadillos, festividades de barrio, jam sessions, open mics, actividades comunitarias.
Busca activamente eventos pequeños con poca visibilidad online.

== FORMATO DE SALIDA (OBLIGATORIO) ==
Responde ÚNICAMENTE con un array JSON válido, sin texto antes ni después, sin markdown ni \`\`\`. Cada evento:
{
  "nombre": "string",
  "fecha": "YYYY-MM-DD",
  "hora": "HH:MM o vacío",
  "sala": "nombre del recinto o ubicación",
  "ciudad": "Vigo|Pontevedra|Cangas|Redondela|etc",
  "pais": "España",
  "precio": "Gratis, 5€, o vacío",
  "enlace": "URL o vacío",
  "categoria": "concierto|festival|cine|charla|teatro|expo|mercadillo|otro",
  "razon": "1 frase: qué tipo de evento es"
}
Prioriza verificación sobre cantidad — mejor 10 reales que 20 especulativos. La fecha debe ser concreta (YYYY-MM-DD). Entre 5 y 25 eventos. Si no encuentras, devuelve [].`;

// Main Component
export default function AgendaCultural() {
  const [eventos, setEventos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [vista, setVista] = useState("calendario");
  const [diaSel, setDiaSel] = useState(null);
  const [eventoSel, setEventoSel] = useState(null);
  const [novedades, setNovedades] = useState([]);
  const [novedadesSet, setNovedadesSet] = useState(new Set());
  const [afinidadFil, setAfinidadFil] = useState(new Set(["verde", "amarillo", "rojo"]));
  const [categoriaFil, setCategoriaFil] = useState(new Set(CATEGORIAS));
  const eventosRef = useRef([]);

  // Agenda Local state (completely independent)
  const [eventosLocales, setEventosLocales] = useState([]);
  const [cargandoLocal, setCargandoLocal] = useState(false);
  const [categoriaFilLocal, setCategoriaFilLocal] = useState(new Set(CATEGORIAS_LOCAL));

  // API Call
  const buscar = useCallback(async () => {
    setCargando(true);
    try {
      const response = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [
            {
              role: "user",
              content: `Busca eventos culturales de los próximos 2-3 meses en Vigo, Galicia y norte de Portugal según mi perfil.`,
            },
          ],
          system: SYSTEM_PROMPT,
          tools: [
            {
              type: "web_search_20250305",
              name: "web_search",
            },
          ],
        }),
      });

      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();

      let eventosJSON = [];
      for (const block of data.content || []) {
        if (block.type === "text") {
          const parsed = extraerJSON(block.text);
          if (Array.isArray(parsed)) {
            eventosJSON = parsed;
            break;
          }
        }
      }

      const eventosConId = (eventosJSON || []).map((e) => ({
        ...e,
        id: hashId(e),
      }));

      const prevIds = new Set(eventosRef.current.map((e) => e.id));
      const nuevosIds = eventosConId
        .filter((e) => !prevIds.has(e.id))
        .map((e) => e.id);

      eventosRef.current = eventosConId;
      setEventos(eventosConId);
      setNovedades(nuevosIds);
      setNovedadesSet(new Set(nuevosIds));
    } catch (err) {
      console.error("Error:", err);
      alert("Error al buscar eventos. Verifica tu API key.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    buscar();
  }, [buscar]);

  const buscarLocal = useCallback(async () => {
    setCargandoLocal(true);
    try {
      const response = await fetch("/api/anthropic/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 3000,
          messages: [{ role: "user", content: "Busca todos los eventos culturales en Vigo y alrededores para los próximos 7-14 días." }],
          system: SYSTEM_PROMPT_LOCAL,
          tools: [{ type: "web_search_20250305", name: "web_search" }],
        }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      let eventosJSON = [];
      for (const block of data.content || []) {
        if (block.type === "text") {
          const parsed = extraerJSON(block.text);
          if (Array.isArray(parsed)) { eventosJSON = parsed; break; }
        }
      }
      setEventosLocales((eventosJSON || []).map((e) => ({ ...e, id: hashId(e) })));
    } catch (err) {
      console.error("Error Agenda Local:", err);
      alert("Error al buscar eventos locales. Verifica tu API key.");
    } finally {
      setCargandoLocal(false);
    }
  }, []);

  // Filtering
  const visibles = eventos.filter((e) => afinidadFil.has(e.afinidad) && categoriaFil.has(e.categoria));

  // Remove Event
  const quitarEvento = (id) => {
    setEventos((prev) => prev.filter((e) => e.id !== id));
  };

  // Calendar Grid
  const hoy = new Date();
  const mesActual = hoy.getMonth();
  const añoActual = hoy.getFullYear();
  const primerDia = new Date(añoActual, mesActual, 1);
  const diasDelMes = new Date(añoActual, mesActual + 1, 0).getDate();
  const diasAnteriores = (primerDia.getDay() + 6) % 7;

  const dias = [];
  for (let i = -diasAnteriores; i < diasDelMes; i++) {
    const fecha = new Date(primerDia);
    fecha.setDate(fecha.getDate() + i);
    const fechaStr = fecha.toISOString().split("T")[0];
    dias.push({
      fecha: fechaStr,
      dia: fecha.getDate(),
      mesActual: fecha.getMonth() === mesActual,
      esHoy: fechaStr === hoy.toISOString().split("T")[0],
    });
  }

  const detalle = diaSel
    ? visibles.filter((e) => e.fecha === diaSel)
    : eventoSel
      ? [eventoSel]
      : visibles.slice(0, 5);

  const tituloDetalle = diaSel
    ? `Eventos del ${formatearFecha(diaSel)}`
    : "Próximos eventos";

  return (
    <div style={{ minHeight: "100vh", background: CREMA, padding: 20, fontFamily: "system-ui" }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ marginBottom: 30 }}>
          <h1 style={{ fontFamily: "'Lora', serif", fontSize: 28, fontWeight: 700, margin: 0, marginBottom: 6, color: "#2a2420" }}>
            Agenda Cultural de Rodrigo
          </h1>
          <p style={{ color: "#6b635a", margin: 0, fontSize: 14 }}>Vigo, Galicia — Próximos eventos</p>
        </div>

        {/* Controls */}
        <div style={{ background: "#fff", borderRadius: 12, padding: 16, marginBottom: 24, boxShadow: "0 1px 3px rgba(60,50,40,0.06)" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            <button
              onClick={() => setVista("calendario")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: vista === "calendario" ? `2px solid ${ACENTO}` : "1px solid #d8d2c8",
                background: vista === "calendario" ? ACENTO : "#fff",
                color: vista === "calendario" ? "#fff" : "#5a5249",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              📅 Calendario
            </button>
            <button
              onClick={() => setVista("lista")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: vista === "lista" ? `2px solid ${ACENTO}` : "1px solid #d8d2c8",
                background: vista === "lista" ? ACENTO : "#fff",
                color: vista === "lista" ? "#fff" : "#5a5249",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              📋 Lista
            </button>
            {vista !== "local" && (
              <button
                onClick={buscar}
                disabled={cargando}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: `1px solid ${cargando ? "#d8d2c8" : ACENTO}`,
                  background: cargando ? "#f0eee9" : ACENTO,
                  color: cargando ? "#9a9088" : "#fff",
                  cursor: cargando ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {cargando ? "Buscando..." : "🔄 Buscar"}
              </button>
            )}
            {vista === "local" && (
              <button
                onClick={buscarLocal}
                disabled={cargandoLocal}
                style={{
                  padding: "8px 14px",
                  borderRadius: 6,
                  border: `1px solid ${cargandoLocal ? "#d8d2c8" : "#4a7a5a"}`,
                  background: cargandoLocal ? "#f0eee9" : "#4a7a5a",
                  color: cargandoLocal ? "#9a9088" : "#fff",
                  cursor: cargandoLocal ? "default" : "pointer",
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                {cargandoLocal ? "Buscando..." : "📍 Buscar Agenda Local"}
              </button>
            )}
            <button
              onClick={() => setVista("local")}
              style={{
                padding: "8px 14px",
                borderRadius: 6,
                border: vista === "local" ? "2px solid #4a7a5a" : "1px solid #d8d2c8",
                background: vista === "local" ? "#4a7a5a" : "#fff",
                color: vista === "local" ? "#fff" : "#5a5249",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              📍 Agenda Local
            </button>
          </div>

          {/* Filters — main search */}
          {vista !== "local" && (
            <>
              <Fila titulo="Afinidad">
                {["verde", "amarillo", "rojo"].map((a) => (
                  <Chip
                    key={a}
                    activo={afinidadFil.has(a)}
                    color={COLOR_AFINIDAD[a]}
                    onClick={() => {
                      const newSet = new Set(afinidadFil);
                      if (newSet.has(a)) newSet.delete(a);
                      else newSet.add(a);
                      setAfinidadFil(newSet);
                    }}
                  >
                    {ETIQUETA_AFINIDAD[a]}
                  </Chip>
                ))}
              </Fila>
              <Fila titulo="Categoría">
                {CATEGORIAS.map((c) => (
                  <Chip
                    key={c}
                    activo={categoriaFil.has(c)}
                    onClick={() => {
                      const newSet = new Set(categoriaFil);
                      if (newSet.has(c)) newSet.delete(c);
                      else newSet.add(c);
                      setCategoriaFil(newSet);
                    }}
                  >
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
                <Chip
                  key={c}
                  activo={categoriaFilLocal.has(c)}
                  onClick={() => {
                    const newSet = new Set(categoriaFilLocal);
                    if (newSet.has(c)) newSet.delete(c);
                    else newSet.add(c);
                    setCategoriaFilLocal(newSet);
                  }}
                >
                  {ICONO_CAT[c]} {c}
                </Chip>
              ))}
            </Fila>
          )}
        </div>

        {/* Novedades Badge */}
        {novedades.length > 0 && (
          <div style={{ background: "#5a7d4f", color: "#fff", borderRadius: 8, padding: 12, marginBottom: 20, fontSize: 13, textAlign: "center" }}>
            ✨ {novedades.length} evento(s) nuevo(s) desde la última búsqueda
          </div>
        )}

        {/* Content */}
        {eventos.length === 0 && !cargando && (
          <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px" }}>
            <p>No hay eventos aún. Haz clic en "Buscar" para empezar.</p>
          </div>
        )}

        {/* Calendar View */}
        {vista === "calendario" && eventos.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 20, boxShadow: "0 1px 3px rgba(60,50,40,0.06)" }}>
            <h2 style={{ fontFamily: "'Lora', serif", fontSize: 18, fontWeight: 600, margin: "0 0 16px", textTransform: "capitalize" }}>
              {MESES[mesActual]} {añoActual}
            </h2>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 16 }}>
              {DIAS_SEM.map((d) => (
                <div key={d} style={{ textAlign: "center", fontFamily: "'DM Mono', monospace", fontSize: 11, fontWeight: 600, color: "#a59a8d", textTransform: "uppercase", marginBottom: 8 }}>
                  {d}
                </div>
              ))}
              {dias.map((c) => {
                const evs = visibles.filter((e) => e.fecha === c.fecha);
                const sel = c.fecha === diaSel;
                const esHoy = c.esHoy;
                return (
                  <div
                    key={c.fecha}
                    onClick={() => {
                      if (evs.length) {
                        setDiaSel(c.fecha);
                        setEventoSel(null);
                      }
                    }}
                    style={{
                      minHeight: 72,
                      background: c.mesActual ? "#fff" : "#f6f3ed",
                      borderRadius: 8,
                      border: sel ? `2px solid ${ACENTO}` : esHoy ? "2px solid #d8c4a6" : "1px solid #ece7df",
                      padding: 4,
                      cursor: evs.length ? "pointer" : "default",
                      opacity: c.mesActual ? 1 : 0.55,
                      overflow: "hidden",
                    }}
                  >
                    <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 11.5, textAlign: "right", color: esHoy ? ACENTO : "#9a9088", fontWeight: esHoy ? 600 : 400, padding: "1px 3px" }}>
                      {c.dia}
                    </div>
                    {evs.slice(0, 2).map((e) => (
                      <div
                        key={e.id}
                        onClick={(ev) => {
                          ev.stopPropagation();
                          setEventoSel(e);
                          setDiaSel(c.fecha);
                        }}
                        title={e.nombre}
                        style={{
                          background: COLOR_AFINIDAD[e.afinidad] || "#999",
                          color: "#fff",
                          borderRadius: 4,
                          fontSize: 9.5,
                          padding: "2px 4px",
                          marginTop: 2,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          fontFamily: "system-ui",
                          lineHeight: 1.3,
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

            <div style={{ display: "flex", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
              {["verde", "amarillo", "rojo"].map((a) => (
                <span key={a} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11.5, color: "#6b635a", fontFamily: "'DM Mono', monospace" }}>
                  <span style={{ width: 11, height: 11, borderRadius: 3, background: COLOR_AFINIDAD[a], display: "inline-block" }} />
                  {ETIQUETA_AFINIDAD[a]}
                </span>
              ))}
            </div>

            {detalle.length > 0 && (
              <div style={{ marginTop: 18 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <h3 style={{ fontFamily: "'Lora', serif", fontSize: 17, fontWeight: 600, margin: 0, textTransform: "capitalize" }}>
                    {eventoSel ? "Evento seleccionado" : tituloDetalle}
                  </h3>
                  <button
                    onClick={() => {
                      setDiaSel(null);
                      setEventoSel(null);
                    }}
                    style={{ background: "none", border: "none", color: ACENTO, cursor: "pointer", fontSize: 13, fontFamily: "system-ui" }}
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
        )}

        {/* List View */}
        {vista === "lista" && eventos.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
            {[...visibles]
              .sort((a, b) => {
                const o = { verde: 0, amarillo: 1, rojo: 2 };
                const da = o[a.afinidad] ?? 3,
                  db = o[b.afinidad] ?? 3;
                if (da !== db) return da - db;
                return (a.fecha || "9999").localeCompare(b.fecha || "9999");
              })
              .map((e) => (
                <TarjetaEvento key={e.id} e={e} esNuevo={novedadesSet.has(e.id)} onQuitar={() => quitarEvento(e.id)} />
              ))}
            {visibles.length === 0 && (
              <p style={{ color: "#9a9088", fontStyle: "italic", textAlign: "center" }}>Ningún evento con estos filtros.</p>
            )}
          </div>
        )}

        {/* Agenda Local View */}
        {vista === "local" && (
          <div>
            {eventosLocales.length === 0 && !cargandoLocal && (
              <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px" }}>
                <p style={{ fontSize: 15, marginBottom: 8 }}>📍 Agenda Local — Vigo y alrededores</p>
                <p style={{ fontSize: 13 }}>Haz clic en "Buscar Agenda Local" para encontrar eventos de los próximos 7-14 días.</p>
              </div>
            )}
            {cargandoLocal && (
              <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px", fontSize: 14 }}>
                Buscando eventos locales en Vigo...
              </div>
            )}
            {eventosLocales.length > 0 && (
              <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
                {[...eventosLocales]
                  .filter((e) => categoriaFilLocal.has(e.categoria))
                  .sort((a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999"))
                  .map((e) => (
                    <TarjetaEvento
                      key={e.id}
                      e={{ ...e, afinidad: "local" }}
                      esNuevo={false}
                      onQuitar={() => setEventosLocales((prev) => prev.filter((ev) => ev.id !== e.id))}
                    />
                  ))}
                {eventosLocales.filter((e) => categoriaFilLocal.has(e.categoria)).length === 0 && (
                  <p style={{ color: "#9a9088", fontStyle: "italic", textAlign: "center" }}>Ningún evento con estos filtros.</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Subcomponents
function Fila({ titulo, children }) {
  return (
    <div style={{ marginBottom: 8 }}>
      <div style={{ fontFamily: "'DM Mono', monospace", fontSize: 10, letterSpacing: 1.5, color: "#a59a8d", textTransform: "uppercase", marginBottom: 6 }}>
        {titulo}
      </div>
      <div style={{ display: "flex", gap: 7, flexWrap: "wrap" }}>{children}</div>
    </div>
  );
}

function Chip({ activo, onClick, children, color }) {
  const ACENTO = "#7a4a10";
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
        fontFamily: "system-ui",
        textTransform: "capitalize",
      }}
    >
      {children}
    </button>
  );
}

function TarjetaEvento({ e, onQuitar, esNuevo }) {
  const COLOR_AFINIDAD = { verde: "#5a7d4f", amarillo: "#c9962e", rojo: "#b15436" };
  const ICONO_CAT = { concierto: "🎵", festival: "🎪", cine: "🎬", charla: "🎙️", humor: "😄", otro: "✨" };
  const ETIQUETA_DIST = { local: "Cerca · Galicia", cerca: "Norte Portugal / Lisboa", lejos: "Lejos" };
  const BANDERA = { España: "🇪🇸", Portugal: "🇵🇹" };
  const ACENTO = "#7a4a10";

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
          position: "absolute",
          top: 12,
          right: 12,
          width: 26,
          height: 26,
          borderRadius: "50%",
          border: "none",
          background: "#f3efe8",
          color: "#998f82",
          cursor: "pointer",
          fontSize: 15,
          lineHeight: 1,
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
          <span style={{ fontFamily: "'DM Mono', monospace", fontSize: 10.5, color: "#b0a698" }}>
            · {ETIQUETA_DIST[e.distancia] || ""}
          </span>
          {esNuevo && (
            <span
              style={{
                background: "#5a7d4f",
                color: "#fff",
                fontSize: 9.5,
                fontWeight: 700,
                borderRadius: 4,
                padding: "2px 6px",
                letterSpacing: 0.5,
                fontFamily: "system-ui",
              }}
            >
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
            📍 {e.sala}
            {e.sala && e.ciudad ? " · " : ""}
            {e.ciudad} {BANDERA[e.pais] || ""}
          </div>
          {e.precio && <div>🎟️ {e.precio}</div>}
        </div>
        {e.razon && (
          <p
            style={{
              fontSize: 13.5,
              color: "#6b635a",
              fontStyle: "italic",
              margin: "10px 0 0",
              lineHeight: 1.5,
              borderLeft: `2px solid ${color}`,
              paddingLeft: 10,
            }}
          >
            {e.razon}
          </p>
        )}
        <div style={{ display: "flex", gap: 14, marginTop: 12, flexWrap: "wrap", alignItems: "center" }}>
          {e.enlace && (
            <a
              href={e.enlace}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: ACENTO, textDecoration: "none", fontWeight: 600, fontFamily: "system-ui" }}
            >
              Entradas / info →
            </a>
          )}
          {googleCalUrl(e) && (
            <a
              href={googleCalUrl(e)}
              target="_blank"
              rel="noopener noreferrer"
              style={{ fontSize: 13, color: "#3367d6", textDecoration: "none", fontWeight: 600, fontFamily: "system-ui" }}
            >
              📅 Añadir a Google Calendar
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
