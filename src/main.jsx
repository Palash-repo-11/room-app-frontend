import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import { MeetingProvider } from './provider/MeetingProvider.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MeetingProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </MeetingProvider>
  </StrictMode>,
)
