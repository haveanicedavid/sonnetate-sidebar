import { db } from '@/db'

import { Auth } from './pages/auth'
import { UserInfo } from './pages/user-info'
import { Routes } from './routes'

// TODO: fugly
function App() {
  const {
    isLoading: isLoadingAuth,
    user: authUser,
    error: authError,
  } = db.useAuth()
  const {
    error: userError,
    data: userData,
  } = db.useQuery({
    users: {
      $: {
        where: {
          id: authUser?.id || '',
        },
      },
    },
  })

  const centered = 'h-screen flex justify-center items-center bg-gray-50 p-4'

  if (isLoadingAuth) {
    return <div className={centered}>Loading...</div>
  }

  if (authError || userError) {
    return (
      <div className={centered}>
        Uh oh! {authError?.message || userError?.message}
      </div>
    )
  }

  if (authUser) {
    const appUser = userData?.users[0]
    return appUser ? <Routes /> : <UserInfo authId={authUser.id} />
  }

  return <Auth />
}

export default App
