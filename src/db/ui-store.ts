import { atom, useAtom } from 'jotai'

import type { User } from './types'

export const userAtom = atom<User | null>(null)

export function useUserAtom() {
  return useAtom(userAtom)
}
