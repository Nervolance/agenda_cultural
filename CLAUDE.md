# Agenda Cultural de Rodrigo

## Stack
- Frontend: React + HTML/CSS/JavaScript
- APIs: Anthropic Claude (web_search), Google Calendar, Leaflet/OpenStreetMap
- Storage: window.storage + localStorage
- Event sources: hoxe.vigo.org, viralagenda.com, metropolitano.gal

## Architecture
- Three views: Calendar, List, Map
- Agenda Local: Independent search (no taste filtering)
- Main search: Profile-curated discovery
- Color coding: Green/Yellow/Red affinity

## Key Rules
- NEVER merge Agenda Local and main search logic
- Use str_replace for surgical edits, not full rewrites
- Small/low-SEO local events matter (poster scanning feature planned)