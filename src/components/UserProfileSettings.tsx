import React, { useState, useEffect } from 'react'
import './UserProfileSettings.css'

interface FormFields {
  username: string
  email: string
  bio: string
  theme: 'light' | 'dark'
  newsletter: boolean
}

interface FormErrors {
  username?: string
  email?: string
  bio?: string
}

export const UserProfileSettings: React.FC = () => {
  const [fields, setFields] = useState<FormFields>({
    username: '',
    email: '',
    bio: '',
    theme: 'light',
    newsletter: false,
  })

  const [errors, setErrors] = useState<FormErrors>({})
  const [success, setSuccess] = useState(false)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('profile-settings')
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as FormFields
        setFields(parsed)
        applyTheme(parsed.theme)
      } catch (e) {
        console.error('Failed to parse settings', e)
      }
    } else {
      // Apply default light theme
      applyTheme('light')
    }
  }, [])

  const applyTheme = (theme: 'light' | 'dark') => {
    document.documentElement.setAttribute('data-theme', theme)
  }

  const validateField = (name: keyof FormFields, value: any): string | undefined => {
    if (name === 'username') {
      const usernameValue = value as string
      if (!usernameValue.trim()) {
        return 'Username is required.'
      }
      if (usernameValue.length < 3 || usernameValue.length > 15) {
        return 'Username must be between 3 and 15 characters.'
      }
      if (!/^[a-z0-9]+$/.test(usernameValue)) {
        return 'Username must be lowercase and alphanumeric only (no spaces or special chars).'
      }
    }

    if (name === 'email') {
      const emailValue = value as string
      if (!emailValue.trim()) {
        return 'Email address is required.'
      }
      const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
      if (!emailRegex.test(emailValue)) {
        return 'Please enter a valid email address (e.g. user@example.com).'
      }
    }

    if (name === 'bio') {
      const bioValue = value as string
      if (bioValue.length > 150) {
        return 'Bio cannot exceed 150 characters.'
      }
    }

    return undefined
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value

    setFields((prev) => {
      const updated = { ...prev, [name]: val }
      
      // If the field has been touched or already has an error, validate it live
      if (errors[name as keyof FormErrors] || touched[name]) {
        const error = validateField(name as keyof FormFields, val)
        setErrors((errs) => ({
          ...errs,
          [name]: error,
        }))
      }

      if (name === 'theme') {
        applyTheme(val as 'light' | 'dark')
      }

      return updated
    })
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
    const error = validateField(name as keyof FormFields, value)
    setErrors((errs) => ({
      ...errs,
      [name]: error,
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate all fields
    const newErrors: FormErrors = {}
    let hasErrors = false

    const usernameError = validateField('username', fields.username)
    if (usernameError) {
      newErrors.username = usernameError
      hasErrors = true
    }

    const emailError = validateField('email', fields.email)
    if (emailError) {
      newErrors.email = emailError
      hasErrors = true
    }

    const bioError = validateField('bio', fields.bio)
    if (bioError) {
      newErrors.bio = bioError
      hasErrors = true
    }

    setErrors(newErrors)
    setTouched({ username: true, email: true, bio: true })

    if (!hasErrors) {
      localStorage.setItem('profile-settings', JSON.stringify(fields))
      setSuccess(true)
      setTimeout(() => setSuccess(false), 5000) // Reset success banner after 5s
    } else {
      setSuccess(false)
      // Focus on first input with error for accessibility
      if (newErrors.username) {
        document.getElementById('username')?.focus()
      } else if (newErrors.email) {
        document.getElementById('email')?.focus()
      } else if (newErrors.bio) {
        document.getElementById('bio')?.focus()
      }
    }
  }

  const isBioWarning = fields.bio.length > 130
  const isBioLimitExceeded = fields.bio.length > 150

  return (
    <div className="settings-container">
      <div className="settings-card">
        <div className="settings-header">
          <svg className="settings-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.1a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
          <h2>Profile Settings</h2>
          <p>Update your public profile, appearance preference, and email notifications.</p>
        </div>

        {success && (
          <div className="success-toast" role="status" aria-live="polite">
            <svg className="toast-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <span>Settings saved successfully!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div className={`form-group ${errors.username ? 'has-error' : ''}`}>
            <label htmlFor="username">
              Username <span className="required-star">*</span>
            </label>
            <div className="input-wrapper">
              <span className="input-prefix">@</span>
              <input
                type="text"
                id="username"
                name="username"
                value={fields.username}
                onChange={handleChange}
                onBlur={handleBlur}
                aria-invalid={errors.username ? 'true' : 'false'}
                aria-describedby={errors.username ? 'username-error' : 'username-hint'}
                placeholder="johndoe"
                className="input-field prefix-padding"
                required
              />
            </div>
            {errors.username ? (
              <p id="username-error" className="error-message" role="alert">
                {errors.username}
              </p>
            ) : (
              <p id="username-hint" className="hint-message">
                3-15 chars, lowercase letters and numbers only.
              </p>
            )}
          </div>

          {/* Email */}
          <div className={`form-group ${errors.email ? 'has-error' : ''}`}>
            <label htmlFor="email">
              Email Address <span className="required-star">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
              placeholder="you@example.com"
              className="input-field"
              required
            />
            {errors.email && (
              <p id="email-error" className="error-message" role="alert">
                {errors.email}
              </p>
            )}
          </div>

          {/* Bio */}
          <div className={`form-group ${errors.bio ? 'has-error' : ''}`}>
            <div className="label-row">
              <label htmlFor="bio">Bio</label>
              <span 
                className={`char-counter ${isBioWarning ? 'warning' : ''} ${isBioLimitExceeded ? 'limit-exceeded' : ''}`}
                aria-live="polite"
              >
                {fields.bio.length} / 150
              </span>
            </div>
            <textarea
              id="bio"
              name="bio"
              value={fields.bio}
              onChange={handleChange}
              onBlur={handleBlur}
              aria-invalid={errors.bio ? 'true' : 'false'}
              aria-describedby={errors.bio ? 'bio-error' : 'bio-hint'}
              placeholder="Tell us a little bit about yourself..."
              className="textarea-field"
              rows={4}
            />
            {errors.bio ? (
              <p id="bio-error" className="error-message" role="alert">
                {errors.bio}
              </p>
            ) : (
              <p id="bio-hint" className="hint-message">
                Brief description for your profile page.
              </p>
            )}
          </div>

          {/* Theme */}
          <div className="form-group">
            <label htmlFor="theme">Interface Theme</label>
            <div className="select-wrapper">
              <select
                id="theme"
                name="theme"
                value={fields.theme}
                onChange={handleChange}
                className="select-field"
              >
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
              <svg className="select-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </div>
          </div>

          {/* Newsletter (Custom Switch) */}
          <div className="form-group checkbox-group">
            <label className="switch-container">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={fields.newsletter}
                onChange={handleChange}
                className="switch-input"
              />
              <span className="switch-slider" />
              <span className="switch-label">Subscribe to email notifications</span>
            </label>
          </div>

          {/* Submit Button */}
          <button type="submit" className="submit-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  )
}
