// TODO: not working - need to research more. Sending url to claude for now
chrome.runtime.onMessage.addListener((request, _sender, sendResponse) => {
  if (request.action === 'getPageContent') {
    console.log('response from content-script')
    sendResponse({ content: document.body.innerText })
  }
  return true
})
