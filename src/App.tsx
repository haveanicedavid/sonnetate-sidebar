import { useState } from 'react'

function App() {
  const [apiKey, setApiKey] = useState('fake-key')
  const [summary, setSummary] = useState('')
  const [customPrompt, setCustomPrompt] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const saveApiKey = () => {
    chrome.storage.sync.set({ apiKey }, () => {
      console.log('API key saved')
    })
  }

  const summarizeWebpage = async () => {
    setIsLoading(true)
    try {
      const [tab] = await chrome.tabs.query({
        active: true,
        currentWindow: true,
      })
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: `Summarize the content of this webpage: ${tab.url}`,
            },
          ],
        }),
      })
      const data = await response.json()
      setSummary(data.content[0].text)
    } catch (error) {
      console.error('Error summarizing webpage:', error)
      setSummary('Error summarizing webpage. Please try again.')
    }
    setIsLoading(false)
  }

  const saveSummary = () => {
    // Implement saving summary functionality
    console.log('Saving summary:', summary)
  }

  const generateCustomPrompt = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: customPrompt,
            },
          ],
        }),
      })
      const data = await response.json()
      setSummary(data.content[0].text)
    } catch (error) {
      console.error('Error generating custom prompt:', error)
      setSummary('Error generating custom prompt. Please try again.')
    }
    setIsLoading(false)
  }

  return (
    <div>
      <h1 className="text-4xl">Mettatate</h1>
      {!apiKey ? (
        <div>
          <input
            type="text"
            placeholder="Enter your API key"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <button onClick={saveApiKey}>Save API Key</button>
        </div>
      ) : (
        <div>
          <button onClick={summarizeWebpage} disabled={isLoading}>
            Summarize Webpage
          </button>
          <button onClick={saveSummary} disabled={!summary || isLoading}>
            Save Summary
          </button>
          <div>
            <input
              type="text"
              placeholder="Enter custom prompt"
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
            />
            <button
              onClick={generateCustomPrompt}
              disabled={!customPrompt || isLoading}
            >
              Generate
            </button>
          </div>
          {isLoading && <p>Loading...</p>}
          {summary && (
            <div>
              <h2>Summary:</h2>
              <p>{summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App
