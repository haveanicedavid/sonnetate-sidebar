chrome.action.onClicked.addListener((tab) => {
  // chrome.sidePanel.open({ tabId: 1 })
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id })
  }
})
