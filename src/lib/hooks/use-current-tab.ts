import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const tabUrlAtom = atom<string | null>(null)
const tabTitleAtom = atom<string | null>(null)

export function useCurrentTab() {
  const [url] = useAtom(tabUrlAtom)
  const [title] = useAtom(tabTitleAtom)
  return { url, title }
}

export function useWatchCurrentTab() {
  const [, setUrl] = useAtom(tabUrlAtom)
  const [, setTitle] = useAtom(tabTitleAtom)

  const updateCurrentTab = useCallback(() => {
    if (!chrome?.tabs?.query) return

    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError)
        return
      }

      const [tab] = tabs
      if (tab) {
        if (tab.url) setUrl(tab.url)
        if (tab.title) setTitle(tab.title)
      }
    })
  }, [setUrl, setTitle])

  useEffect(() => {
    if (!chrome?.tabs?.query) return

    updateCurrentTab()

    const intervalId = setInterval(updateCurrentTab, 3000)

    const tabUpdatedListener = () => {
      updateCurrentTab()
    }

    const tabActivatedListener = () => {
      updateCurrentTab()
    }

    chrome.tabs.onUpdated.addListener(tabUpdatedListener)
    chrome.tabs.onActivated.addListener(tabActivatedListener)

    return () => {
      clearInterval(intervalId)
      chrome.tabs.onUpdated.removeListener(tabUpdatedListener)
      chrome.tabs.onActivated.removeListener(tabActivatedListener)
    }
  }, [updateCurrentTab])
}
