import { useState } from 'react';
import { creatorSettingsSchema } from './schema';
import './App.css';

function App() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [payoutEmail, setPayoutEmail] = useState('');
  const [bio, setBio] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [newsletter, setNewsletter] = useState(false);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = creatorSettingsSchema.safeParse({
      username,
      email,
      payoutEmail,
      bio,
      theme,
      newsletter,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        const path = issue.path[0] as string;
        if (path) {
          fieldErrors[path] = issue.message;
        }
      });
      setErrors(fieldErrors);
      setSuccess(false);
    } else {
      setErrors({});
      setSuccess(true);
      console.log('Saved settings:', result.data);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h2>Settings (Round 2)</h2>
      {success && <div style={{ color: 'green', marginBottom: '10px' }}>Settings saved successfully!</div>}
      <form onSubmit={handleSubmit} noValidate>
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.email && <span style={{ color: 'red', fontSize: '12px' }}>{errors.email}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Payout Email:</label>
          <input
            type="email"
            value={payoutEmail}
            onChange={(e) => setPayoutEmail(e.target.value)}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
          {errors.payoutEmail && <span style={{ color: 'red', fontSize: '12px' }}>{errors.payoutEmail}</span>}
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
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
          {errors.theme && <span style={{ color: 'red', fontSize: '12px' }}>{errors.theme}</span>}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
            />{' '}
            Subscribe to newsletter
          </label>
          {errors.newsletter && <span style={{ color: 'red', fontSize: '12px' }}>{errors.newsletter}</span>}
        </div>

        <button
          type="submit"
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Save Settings
        </button>
      </form>
    </div>
  );
}

export default App;
