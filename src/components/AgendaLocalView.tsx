import type { Evento } from "../types";
import TarjetaEvento from "./TarjetaEvento";

interface Props {
  eventosLocales: Evento[];
  cargandoLocal: boolean;
  categoriaFilLocal: Set<string>;
  setEventosLocales: React.Dispatch<React.SetStateAction<Evento[]>>;
}

export default function AgendaLocalView({ eventosLocales, cargandoLocal, categoriaFilLocal, setEventosLocales }: Props) {
  if (cargandoLocal) {
    return (
      <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px", fontSize: 14 }}>
        Buscando eventos locales en Vigo...
      </div>
    );
  }

  if (eventosLocales.length === 0) {
    return (
      <div style={{ textAlign: "center", color: "#9a9088", padding: "40px 20px" }}>
        <p style={{ fontSize: 15, marginBottom: 8 }}>📍 Agenda Local — Vigo y alrededores</p>
        <p style={{ fontSize: 13 }}>Haz clic en "Buscar Agenda Local" para encontrar eventos de los próximos 7-14 días.</p>
      </div>
    );
  }

  const visibles = eventosLocales
    .filter((e) => categoriaFilLocal.has(e.categoria))
    .sort((a, b) => (a.fecha || "9999").localeCompare(b.fecha || "9999"));

  const quitar = (id: string) => setEventosLocales((prev) => prev.filter((e) => e.id !== id));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {visibles.map((e) => (
        <TarjetaEvento
          key={e.id}
          e={{ ...e, afinidad: "local" }}
          esNuevo={false}
          onQuitar={() => quitar(e.id)}
        />
      ))}
      {visibles.length === 0 && (
        <p style={{ color: "#9a9088", fontStyle: "italic", textAlign: "center" }}>Ningún evento con estos filtros.</p>
      )}
    </div>
  );
}
