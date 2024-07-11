import { atom, useAtom } from 'jotai'

import type { User } from './types'

/**
 * User gets set in `App.tsx` and main routes won't render until it's set.
 * Type coercion is to avoid needing a bunch of optional chaining.
 */
export const userAtom = atom<User>({} as User)

export function useUser() {
  return useAtom(userAtom)
}
