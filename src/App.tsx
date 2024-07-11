import { useEffect } from 'react'

import { db } from '@/db'

import { LoadingScreen } from './components/loading-screen'
import { useUser } from './db/ui-store'
import { useWatchCurrentTab } from './lib/hooks/use-current-tab'
import { AuthPage } from './pages/auth'
import { UserInfoPage } from './pages/user-info'
import { Routes } from './routes'

// Logic here is a big obfuscated because I need both an AuthUser and a user
// from the users table
function App() {
  useWatchCurrentTab()

  const [user, setUser] = useUser()
  const {
    isLoading: isLoadingAuth,
    user: authUser,
    error: authError,
  } = db.useAuth()
  const { error: userError, data: userData } = db.useQuery({
    users: {
      $: {
        where: {
          id: authUser?.id || '',
        },
      },
    },
  })

  const appUser = userData?.users[0]

  useEffect(() => {
    // setup jotai user... context alternative
    if (appUser?.id) {
      setUser(appUser)
    }
  }, [appUser, setUser])

  if (isLoadingAuth) {
    return <LoadingScreen />
  }

  if (authError || userError) {
    return (
      <div className="h-screen flex justify-center items-center bg-gray-50 p-4">
        Uh oh! {authError?.message || userError?.message}
      </div>
    )
  }

  if (authUser) {
    // check that jotai has user before rendering routes. UserInfoPage doesn't need
    return user?.id ? <Routes /> : <UserInfoPage authId={authUser.id} />
  }

  return <AuthPage />
}

export default App
