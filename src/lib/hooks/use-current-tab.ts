import { atom, useAtom } from 'jotai'
import { useCallback, useEffect } from 'react'

const tabUrlAtom = atom<string>('https://sonnetate.vercel.app/')
const tabTitleAtom = atom<string>('sonnetate')

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

      const tab = tabs[0]
      if (tab?.id) {
        chrome.tabs.get(tab.id, (currentTab) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError)
            return
          }

          if (currentTab) {
            setUrl(currentTab.url || '')
            setTitle(currentTab.title || '')
          }
        })
      }
    })
  }, [setUrl, setTitle])

  useEffect(() => {
    if (!chrome?.tabs?.query) return

    updateCurrentTab()

    const handleTabUpdated = (_tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      if (changeInfo.status === 'complete') {
        updateCurrentTab()
      }
    }

    const handleTabActivated = () => {
      updateCurrentTab()
    }

    chrome.tabs.onUpdated.addListener(handleTabUpdated)
    chrome.tabs.onActivated.addListener(handleTabActivated)

    return () => {
      chrome.tabs.onUpdated.removeListener(handleTabUpdated)
      chrome.tabs.onActivated.removeListener(handleTabActivated)
    }
  }, [updateCurrentTab])
}
