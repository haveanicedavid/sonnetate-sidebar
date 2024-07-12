import { atom, useAtom } from 'jotai'
import { useEffect } from 'react'

type Theme = 'dark' | 'light' | 'system'

const storageKey = 'sonnetate-ui-theme'
const defaultTheme = localStorage.getItem(storageKey) as Theme || 'system'

const themeAtom = atom<Theme>(defaultTheme)

export function useTheme() {
  const [theme, setAtomTheme] = useAtom(themeAtom)
  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'

      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const setTheme = (theme: Theme) => {
    localStorage.setItem(storageKey, theme)
    setAtomTheme(theme)
  }
  return { theme, setTheme }
}

