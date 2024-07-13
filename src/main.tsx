import { Provider as JotaiProvider } from 'jotai'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter } from 'react-router-dom'

import App from './App.tsx'
import './styles/globals.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <JotaiProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </JotaiProvider>
  </React.StrictMode>
)
