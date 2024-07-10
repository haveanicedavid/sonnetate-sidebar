import { useEffect } from 'react'

import { db } from '@/db'

import { LoadingScreen } from './components/loading-screen'
import { useUserAtom } from './db/ui-store'
import { useWatchCurrentTab } from './lib/hooks/use-current-tab'
import { Auth } from './pages/auth'
import { UserInfo } from './pages/user-info'
import { Routes } from './routes'

// TODO: fugly
function App() {
  useWatchCurrentTab()

  const [user, setUser] = useUserAtom()
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
    return user?.id ? <Routes /> : <UserInfo authId={authUser.id} />
  }

  return <Auth />
}

export default App
