import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { Layout } from './components/layout'
import { HomePage } from './pages/home'

export function Routes() {
  return (
    <ReactRoutes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
      </Route>
    </ReactRoutes>
  )
}
