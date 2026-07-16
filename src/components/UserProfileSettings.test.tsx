import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserProfileSettings } from './UserProfileSettings'

describe('UserProfileSettings Component', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.removeAttribute('data-theme')
  })

  it('renders correctly with default fields and accessibility attributes', () => {
    render(<UserProfileSettings />)
    
    // Check titles/headers
    expect(screen.getByRole('heading', { name: /Profile Settings/i })).toBeInTheDocument()
    
    // Check input elements by label
    const usernameInput = screen.getByLabelText(/Username/i)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const bioInput = screen.getByLabelText(/Bio/i)
    
    expect(usernameInput).toBeInTheDocument()
    expect(emailInput).toBeInTheDocument()
    expect(bioInput).toBeInTheDocument()
    
    // Accessibility: check initial aria attributes
    expect(usernameInput).toHaveAttribute('aria-invalid', 'false')
    expect(usernameInput).toHaveAttribute('aria-describedby')
  })

  it('shows error messages for invalid username', () => {
    render(<UserProfileSettings />)
    const usernameInput = screen.getByLabelText(/Username/i)
    
    // Short username
    fireEvent.change(usernameInput, { target: { value: 'ab' } })
    fireEvent.blur(usernameInput)
    expect(screen.getByText(/Username must be between 3 and 15 characters./i)).toBeInTheDocument()
    expect(usernameInput).toHaveAttribute('aria-invalid', 'true')
    
    // Uppercase or special characters
    fireEvent.change(usernameInput, { target: { value: 'John_Doe' } })
    expect(screen.getByText(/Username must be lowercase and alphanumeric only/i)).toBeInTheDocument()
  })

  it('shows error messages for invalid email', () => {
    render(<UserProfileSettings />)
    const emailInput = screen.getByLabelText(/Email Address/i)
    
    fireEvent.change(emailInput, { target: { value: 'invalid-email' } })
    fireEvent.blur(emailInput)
    expect(screen.getByText(/Please enter a valid email address/i)).toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'true')
    
    // Correcting clears error
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } })
    expect(screen.queryByText(/Please enter a valid email address/i)).not.toBeInTheDocument()
    expect(emailInput).toHaveAttribute('aria-invalid', 'false')
  })

  it('handles bio length constraints and live character counting', () => {
    render(<UserProfileSettings />)
    const bioInput = screen.getByLabelText(/Bio/i)
    
    expect(screen.getByText('0 / 150')).toBeInTheDocument()
    
    fireEvent.change(bioInput, { target: { value: 'A'.repeat(140) } })
    expect(screen.getByText('140 / 150')).toBeInTheDocument()
    
    // Exceeding 150 shows error on blur
    fireEvent.change(bioInput, { target: { value: 'A'.repeat(151) } })
    fireEvent.blur(bioInput)
    expect(screen.getByText(/Bio cannot exceed 150 characters./i)).toBeInTheDocument()
  })

  it('changes theme dynamically', () => {
    render(<UserProfileSettings />)
    const themeSelect = screen.getByLabelText(/Interface Theme/i)
    
    fireEvent.change(themeSelect, { target: { value: 'dark' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    
    fireEvent.change(themeSelect, { target: { value: 'light' } })
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('submits successfully and stores values in localStorage', () => {
    render(<UserProfileSettings />)
    
    const usernameInput = screen.getByLabelText(/Username/i)
    const emailInput = screen.getByLabelText(/Email Address/i)
    const bioInput = screen.getByLabelText(/Bio/i)
    const submitBtn = screen.getByRole('button', { name: /Save Changes/i })
    
    fireEvent.change(usernameInput, { target: { value: 'validuser' } })
    fireEvent.change(emailInput, { target: { value: 'valid@example.com' } })
    fireEvent.change(bioInput, { target: { value: 'Short bio.' } })
    
    fireEvent.click(submitBtn)
    
    expect(screen.getByText(/Settings saved successfully!/i)).toBeInTheDocument()
    
    const savedData = JSON.parse(localStorage.getItem('profile-settings') || '{}')
    expect(savedData.username).toBe('validuser')
    expect(savedData.email).toBe('valid@example.com')
    expect(savedData.bio).toBe('Short bio.')
  })

  it('focuses the first field with errors on submit', () => {
    render(<UserProfileSettings />)
    
    const submitBtn = screen.getByRole('button', { name: /Save Changes/i })
    const usernameInput = screen.getByLabelText(/Username/i)
    
    fireEvent.click(submitBtn)
    
    expect(document.activeElement).toBe(usernameInput)
  })
})
