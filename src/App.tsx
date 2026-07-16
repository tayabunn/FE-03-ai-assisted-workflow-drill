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
      console.log('Saved creator settings successfully:', result.data);
    }
  };

  return (
    <main className="settings-container">
      <h1 className="settings-title">Creator Settings</h1>
      <p className="settings-subtitle">Manage your profile, preferences, and payment settings.</p>

      {success && (
        <div className="form-success-alert" role="status" aria-live="polite">
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          <span>Settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        {/* Username */}
        <div className="form-group">
          <label htmlFor="username" className="form-label">
            Username
            <span className="form-label-hint">3-20 chars, lowercase & underscores</span>
          </label>
          <input
            id="username"
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            aria-invalid={!!errors.username}
            aria-describedby={errors.username ? 'username-error' : undefined}
            placeholder="e.g. creative_mind"
          />
          {errors.username && (
            <span id="username-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.username}
            </span>
          )}
        </div>

        {/* Email */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">Primary Email</label>
          <input
            id="email"
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="e.g. contact@creator.com"
          />
          {errors.email && (
            <span id="email-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.email}
            </span>
          )}
        </div>

        {/* Payout Email */}
        <div className="form-group">
          <label htmlFor="payoutEmail" className="form-label">
            Payout Email
            <span className="form-label-hint">Supports alias routing (e.g. +payout)</span>
          </label>
          <input
            id="payoutEmail"
            type="email"
            className="form-control"
            value={payoutEmail}
            onChange={(e) => setPayoutEmail(e.target.value)}
            aria-invalid={!!errors.payoutEmail}
            aria-describedby={errors.payoutEmail ? 'payoutEmail-error' : undefined}
            placeholder="e.g. finance+payout@creator.com"
          />
          {errors.payoutEmail && (
            <span id="payoutEmail-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.payoutEmail}
            </span>
          )}
        </div>

        {/* Bio */}
        <div className="form-group">
          <label htmlFor="bio" className="form-label">
            Bio
            <span className="form-label-hint">{bio.length}/100 chars</span>
          </label>
          <textarea
            id="bio"
            className="form-control"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            aria-invalid={!!errors.bio}
            aria-describedby={errors.bio ? 'bio-error' : undefined}
            placeholder="Tell your supporters about yourself..."
          />
          {errors.bio && (
            <span id="bio-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.bio}
            </span>
          )}
        </div>

        {/* Theme Select */}
        <div className="form-group">
          <label htmlFor="theme" className="form-label">Preferred Theme</label>
          <select
            id="theme"
            className="form-control"
            value={theme}
            onChange={(e) => setTheme(e.target.value as 'light' | 'dark')}
            aria-invalid={!!errors.theme}
            aria-describedby={errors.theme ? 'theme-error' : undefined}
          >
            <option value="light">Light Theme</option>
            <option value="dark">Dark Theme</option>
          </select>
          {errors.theme && (
            <span id="theme-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.theme}
            </span>
          )}
        </div>

        {/* Newsletter Checkbox */}
        <div className="form-group">
          <label className="form-checkbox-label">
            <input
              type="checkbox"
              checked={newsletter}
              onChange={(e) => setNewsletter(e.target.checked)}
              aria-describedby={errors.newsletter ? 'newsletter-error' : undefined}
            />
            <span>Subscribe to creator growth newsletter</span>
          </label>
          {errors.newsletter && (
            <span id="newsletter-error" className="form-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              {errors.newsletter}
            </span>
          )}
        </div>

        <button type="submit" className="form-submit-btn">
          Save Settings
        </button>
      </form>
    </main>
  );
}

export default App;
