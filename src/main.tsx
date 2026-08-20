import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { startPwaInstallCapture } from './pwa/install'

startPwaInstallCapture()
createRoot(document.getElementById('root')!).render(<StrictMode><App /></StrictMode>)
