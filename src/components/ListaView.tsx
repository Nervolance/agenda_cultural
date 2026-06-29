import type { Evento } from "../types";
import TarjetaEvento from "./TarjetaEvento";

interface Props {
  visibles: Evento[];
  novedadesSet: Set<string>;
  quitarEvento: (id: string) => void;
}

const ORDEN_AFINIDAD: Record<string, number> = { verde: 0, amarillo: 1, rojo: 2 };

export default function ListaView({ visibles, novedadesSet, quitarEvento }: Props) {
  const ordenados = [...visibles].sort((a, b) => {
    const da = ORDEN_AFINIDAD[a.afinidad] ?? 3;
    const db = ORDEN_AFINIDAD[b.afinidad] ?? 3;
    if (da !== db) return da - db;
    return (a.fecha || "9999").localeCompare(b.fecha || "9999");
  });

  if (ordenados.length === 0) {
    return <p style={{ color: "#9a9088", fontStyle: "italic", textAlign: "center" }}>Ningún evento con estos filtros.</p>;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
      {ordenados.map((e) => (
        <TarjetaEvento key={e.id} e={e} esNuevo={novedadesSet.has(e.id)} onQuitar={() => quitarEvento(e.id)} />
      ))}
    </div>
  );
}
