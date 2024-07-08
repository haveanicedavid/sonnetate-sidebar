import { db } from '@/App'

export function signInUser(handle: string, password: string) {
  const query = {
    users: {
      $: {
        where: {
          handle,
        },
      },
    },
  }
  const { error, data } = db.useQuery(query)

  if (error) {
    console.error(error)
    throw new Error(error.message)
  }

  const user = data.users[0]
  console.log('user', user)
  if (user?.password !== password) {
    throw new Error('Invalid password')
  }

  return user
}
