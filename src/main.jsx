import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ERP from './ERP'

createRoot(document.getElementById('root')).render(
  <StrictMode><ERP /></StrictMode>
)