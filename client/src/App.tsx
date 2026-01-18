import { useState, useEffect } from 'react'
import { useAuth } from './context/AuthContext'
import { api, setAuthData, type AuthData } from './api/client'
import './App.css'

function App() {
  const { rawAuthData: authData, isReady } = useAuth()
  const [authInput, setAuthInput] = useState('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [response, setResponse] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setAuthInput(authData ? JSON.stringify(authData, null, 2) : '')
  }, [authData])

  const handleApplyAuth = () => {
    setAuthError(null)
    try {
      const parsed = JSON.parse(authInput) as AuthData
      if (!parsed.type || !parsed.signature) {
        throw new Error('Missing required fields: type, signature')
      }
      setAuthData(parsed)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : 'Invalid JSON')
    }
  }

  const handleFetchMe = async () => {
    setIsLoading(true)
    setError(null)
    setResponse('')

    try {
      const data = await api.get('/api/me')
      setResponse(JSON.stringify(data, null, 2))
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isReady) {
    return <div className="container">Loading...</div>
  }

  return (
    <div className="container">
      <h1>Telegram Mini App</h1>

      <div className="debug-section">
        <h3>Auth Data</h3>
        <textarea
          value={authInput}
          onChange={(e) => setAuthInput(e.target.value)}
          className="debug-textarea"
          rows={5}
          placeholder='{"type": "Telegram", "signature": "..."}'
        />
        {authError && <p className="error-text">{authError}</p>}
        <button onClick={handleApplyAuth} className="primary-button" style={{ marginTop: '0.5rem' }}>
          Apply Auth Data
        </button>
      </div>

      <div className="action-section">
        <button 
          onClick={handleFetchMe} 
          disabled={isLoading}
          className="primary-button"
        >
          {isLoading ? 'Loading...' : 'Fetch /api/me'}
        </button>
      </div>

      {error && (
        <div className="error-section">
          <h3>Error</h3>
          <p className="error-text">{error}</p>
        </div>
      )}

      <div className="response-section">
        <h3>Response</h3>
        <textarea
          readOnly
          value={response}
          placeholder="Response will appear here..."
          className="response-textarea"
          rows={10}
        />
      </div>

    </div>
  )
}

export default App
