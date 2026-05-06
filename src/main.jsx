/* main.jsx — Punto de arranque de React
   Aquí "encendemos" la app y la pegamos al HTML (el div#root) */

import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// createRoot es la forma moderna de React 18 para montar la app
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
