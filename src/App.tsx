import { db } from '@/db'

import { Auth } from './pages/auth'
import { Routes } from './routes'

function App() {
  const {
    isLoading: isLoadingAuth,
    user: authUser,
    error: authError,
  } = db.useAuth()

  const centered = 'h-screen flex justify-center items-center bg-gray-50 p-4'

  if (isLoadingAuth) {
    return <div className={centered}>Loading...</div>
  }

  if (authError) {
    return <div className={centered}>Uh oh! {authError.message}</div>
  }

  if (authUser) {
    return <Routes />
  }

  return <Auth />
}

export default App
