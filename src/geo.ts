const GEO_CACHE_KEY = "ac_geocache";

type GeoCache = Record<string, [number, number] | null>;

function loadCache(): GeoCache {
  try { return JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || "{}"); } catch { return {}; }
}

function saveCache(cache: GeoCache) {
  localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache));
}

export function getCached(sala: string, ciudad: string): [number, number] | null | undefined {
  return loadCache()[`${sala}|${ciudad}`];
}

export async function geocodeSala(sala: string, ciudad: string): Promise<[number, number] | null> {
  const cache = loadCache();
  const key = `${sala}|${ciudad}`;
  if (key in cache) return cache[key];

  const q = encodeURIComponent(`${sala}, ${ciudad}, España`);
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
      { headers: { "User-Agent": "AgendaCulturalRodrigo/1.0" } }
    );
    const data = await res.json();
    const coords: [number, number] | null = data[0]
      ? [parseFloat(data[0].lat), parseFloat(data[0].lon)]
      : null;
    cache[key] = coords;
    saveCache(cache);
    return coords;
  } catch {
    cache[key] = null;
    saveCache(cache);
    return null;
  }
}
