import { Routes as ReactRoutes, Route } from 'react-router-dom'

import { HomePage } from './pages/home'
import { SignInPage } from './pages/sign-in'
import { SignUpPage } from './pages/sign-up'

export function Routes() {
  return (
    <ReactRoutes>
      <Route path="/" element={<HomePage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-up" element={<SignUpPage />} />
    </ReactRoutes>
  )
}
