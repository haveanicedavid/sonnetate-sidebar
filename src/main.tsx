import { id, init, tx } from '@instantdb/react'
import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App.tsx'
import './globals.css'

// ID for app: mettatate-hackathon
const APP_ID = '4db3a9bf-dca6-46cc-acb0-62af5f834da8'

// Optional: Declare your schema for intellisense!
type Schema = {
  todos: Todo
}

const db = init<Schema>({ appId: APP_ID })

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
