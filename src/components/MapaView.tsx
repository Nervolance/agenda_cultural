import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { Evento } from "../types";
import { COLOR_AFINIDAD, ETIQUETA_AFINIDAD, ACENTO } from "../constants";
import { googleCalUrl } from "../utils";
import { geocodeSala, getCached } from "../geo";

const VIGO: [number, number] = [42.2314, -8.7124];

function markerIcon(afinidad: string) {
  const color = COLOR_AFINIDAD[afinidad] || "#6a8a7a";
  return L.divIcon({
    html: `<div style="width:14px;height:14px;border-radius:50%;background:${color};border:2.5px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,0.35)"></div>`,
    className: "",
    iconSize: [14, 14],
    iconAnchor: [7, 7],
    popupAnchor: [0, -12],
  });
}

interface Props {
  visibles: Evento[];
}

export default function MapaView({ visibles }: Props) {
  const [coords, setCoords] = useState<Record<string, [number, number]>>({});
  const [geocodificando, setGeocodificando] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function geocodeAll() {
      // Fill from cache immediately
      const acc: Record<string, [number, number]> = {};
      for (const e of visibles) {
        const c = getCached(e.sala, e.ciudad);
        if (c) acc[e.id] = c;
      }
      setCoords({ ...acc });

      // Geocode uncached ones sequentially — Nominatim: max 1 req/sec
      const sinCoords = visibles.filter((e) => !acc[e.id]);
      if (!sinCoords.length) return;

      setGeocodificando(true);
      for (const e of sinCoords) {
        if (cancelled) break;
        const c = await geocodeSala(e.sala, e.ciudad);
        if (c && !cancelled) {
          acc[e.id] = c;
          setCoords({ ...acc });
        }
        if (!cancelled) await new Promise((r) => setTimeout(r, 1100));
      }
      if (!cancelled) setGeocodificando(false);
    }

    geocodeAll();
    return () => { cancelled = true; };
  }, [visibles]);

  const conCoords = visibles.filter((e) => coords[e.id]);
  const pendientes = visibles.length - conCoords.length;

  return (
    <div style={{ borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(60,50,40,0.06)" }}>
      <MapContainer center={VIGO} zoom={13} style={{ height: 520, width: "100%" }}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {conCoords.map((e) => (
          <Marker key={e.id} position={coords[e.id]} icon={markerIcon(e.afinidad)}>
            <Popup>
              <div style={{ fontFamily: "system-ui", minWidth: 210 }}>
                <div style={{ fontSize: 11, color: COLOR_AFINIDAD[e.afinidad], fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                  {ETIQUETA_AFINIDAD[e.afinidad] || "Local"}
                </div>
                <strong style={{ fontFamily: "'Lora', serif", fontSize: 15, lineHeight: 1.3, display: "block", marginBottom: 6 }}>
                  {e.nombre}
                </strong>
                <div style={{ fontSize: 12, color: "#5a5249", lineHeight: 1.7 }}>
                  <div>📅 {e.fecha}{e.hora ? ` · ${e.hora}` : ""}</div>
                  <div>📍 {e.sala}</div>
                  {e.precio && <div>🎟️ {e.precio}</div>}
                </div>
                {e.razon && (
                  <div style={{ fontSize: 11, color: "#8a7a6a", fontStyle: "italic", marginTop: 5, borderLeft: `2px solid ${COLOR_AFINIDAD[e.afinidad]}`, paddingLeft: 6 }}>
                    {e.razon}
                  </div>
                )}
                <div style={{ marginTop: 8, display: "flex", gap: 10, flexWrap: "wrap" }}>
                  {e.enlace && (
                    <a href={e.enlace} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: ACENTO, fontWeight: 600, textDecoration: "none" }}>
                      Entradas →
                    </a>
                  )}
                  {googleCalUrl(e) && (
                    <a href={googleCalUrl(e)!} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: "#3367d6", fontWeight: 600, textDecoration: "none" }}>
                      📅 Calendario
                    </a>
                  )}
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      {/* Status bar */}
      <div style={{ background: "#fff", borderTop: "1px solid #ece7df", padding: "8px 16px", display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <div style={{ display: "flex", gap: 16 }}>
          {Object.entries(ETIQUETA_AFINIDAD).map(([a, label]) => (
            <span key={a} style={{ display: "flex", alignItems: "center", gap: 5, fontSize: 11.5, color: "#6b635a", fontFamily: "'DM Mono', monospace" }}>
              <span style={{ width: 10, height: 10, borderRadius: "50%", background: COLOR_AFINIDAD[a], display: "inline-block" }} />
              {label}
            </span>
          ))}
        </div>
        <span style={{ fontSize: 11.5, color: "#9a9088", fontFamily: "'DM Mono', monospace" }}>
          {geocodificando
            ? `Geocodificando... ${conCoords.length}/${visibles.length}`
            : `${conCoords.length} eventos${pendientes > 0 ? ` · ${pendientes} sin ubicación` : ""}`}
        </span>
      </div>
    </div>
  );
}
