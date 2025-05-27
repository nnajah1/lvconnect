import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ContextProvider } from './context/AuthContext'
import { FormsProvider } from './context/FormsContext'


createRoot(document.getElementById('root')).render(
  // <React.StrictMode>

  <ContextProvider>

    <FormsProvider>
      <App />
    </FormsProvider>
  </ContextProvider>


  // </React.StrictMode>


)
