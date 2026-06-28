import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename="/ultraagent">
    <App />
    <Toaster
      position="top-right"
      toastOptions={{
        style: { background:'#0d1220', border:'1px solid rgba(255,255,255,.1)', color:'#f1f5f9', fontSize:'13px' },
        success: { iconTheme: { primary:'#00ff87', secondary:'#0d1220' } },
        error:   { iconTheme: { primary:'#f87171', secondary:'#0d1220' } },
      }}
    />
  </BrowserRouter>
)
