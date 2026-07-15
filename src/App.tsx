import { useState } from 'react'
import './App.css'

function App() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [bio, setBio] = useState('')
  const [theme, setTheme] = useState('light')
  const [newsletter, setNewsletter] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}
    if (!username) {
      newErrors.username = 'Username is required'
    } else if (username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters'
    }

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!email.includes('@')) {
      newErrors.email = 'Invalid email address'
    }

    if (bio.length > 100) {
      newErrors.bio = 'Bio must be under 100 characters'
    }

    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      setSuccess(true)
      // Save settings
      console.log({ username, email, bio, theme, newsletter })
    } else {
      setSuccess(false)
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Settings</h2>
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>Settings saved successfully!</div>}
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username}</span>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
          <input 
            type="text" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Bio:</label>
          <textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.bio && <span style={{ color: 'red', fontSize: '12px' }}>{errors.bio}</span>}
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Theme:</label>
          <select 
            value={theme} 
            onChange={(e) => setTheme(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label>
            <input 
              type="checkbox" 
              checked={newsletter} 
              onChange={(e) => setNewsletter(e.target.checked)}
            /> Subscribe to newsletter
          </label>
        </div>
        <button type="submit" style={{ padding: '10px 15px', backgroundColor: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Save
        </button>
      </form>
    </div>
  )
}

export default App
