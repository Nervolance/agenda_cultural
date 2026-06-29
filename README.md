# Agenda Cultural de Rodrigo

App personal para descubrir eventos culturales en Vigo, Galicia y alrededores, filtrados por afinidad musical y cultural usando la API de Anthropic con búsqueda web.

## Stack

- **Frontend**: React + TypeScript + Vite
- **IA**: Anthropic Claude con herramienta `web_search` (búsqueda de eventos en tiempo real)
- **Calendarios**: Google Calendar (añadir eventos con un clic)
- **Fuentes de eventos**: Vigo, Galicia, Norte de Portugal, Lisboa, Madrid/Barcelona

## Funcionalidades

- Búsqueda automática de eventos culturales filtrados por perfil (músical, cine, humor)
- Clasificación por afinidad: verde (muy afín) / amarillo (interés medio) / rojo (quizá)
- Dos vistas: **Calendario mensual** y **Lista** ordenada por afinidad
- Filtros por categoría: concierto, festival, cine, charla, humor
- Añadir eventos a Google Calendar
- Indicador de eventos nuevos desde la última búsqueda

## Instalación

### Requisitos

- [Node.js](https://nodejs.org/) v20 o superior

### Pasos

```bash
npm install
```

Crea un archivo `.env` en la raíz del proyecto:

```
ANTHROPIC_API_KEY=sk-ant-...
```

```bash
npm run dev
```

La app estará disponible en `http://localhost:5173`.

## Seguridad

La API key nunca llega al browser. El dev server de Vite actúa como proxy: las peticiones van a `/api/anthropic/...` y Vite las reenvía a `https://api.anthropic.com` inyectando la key desde el `.env` del servidor.

## Scripts

| Comando | Descripción |
|---|---|
| `npm run dev` | Dev server con hot reload |
| `npm run build` | Build de producción |
| `npm run preview` | Preview del build |

## Flujo de trabajo Git

Dos ramas permanentes:

- **`main`**: rama estable. Solo recibe merges desde `dev` una vez verificado.
- **`dev`**: rama de trabajo diario. Todos los cambios van aquí primero.

```bash
# Trabajar en dev (rama habitual)
git checkout dev

# Cuando los cambios están listos, mergear a main
git checkout main
git merge dev --no-ff
git push origin main
git checkout dev
```

Para proteger `main` en GitHub: Settings → Branches → Add rule → `main` → activar *Require a pull request before merging*.
