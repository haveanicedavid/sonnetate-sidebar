import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

interface Tab {
  id?: number
  url?: string
  title?: string
}

// const tabAtom = atom<Tab>({ id: undefined, url: undefined, title: undefined })
const tabUrlAtom = atom<string | null>(null)

export function useCurrentUrl() {
  const [currentTab] = useAtom(tabUrlAtom)
  return currentTab
}

export function useWatchCurrentTab() {
  const [, setCurrentTab] = useAtom(tabUrlAtom)

  const updateCurrentTab = useCallback(() => {
    if (!chrome?.tabs?.query) return

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
        return
      }

      const [tab] = tabs
      if (tab && tab.url) {
        setCurrentTab(tab.url)
      }
    })
  }, [setCurrentTab])

  useEffect(() => {
    if (!chrome?.tabs?.query) return
    // Initial update
    updateCurrentTab()

    // Set up an interval to periodically check for updates
    const intervalId = setInterval(updateCurrentTab, 5000)

    // Listen for tab changes
    const tabUpdatedListener = () => {
      updateCurrentTab()
    }

    chrome.tabs.onUpdated.addListener(tabUpdatedListener)

    return () => {
      clearInterval(intervalId)
      chrome.tabs.onUpdated.removeListener(tabUpdatedListener)
    }
  }, [updateCurrentTab])
}
