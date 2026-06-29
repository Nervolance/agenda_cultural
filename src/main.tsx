import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import AgendaCultural from './components/AgendaCultural'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AgendaCultural />
  </StrictMode>,
)
