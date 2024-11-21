import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '../test-utils'
import userEvent from '@testing-library/user-event'
import { Login } from '@/Pages/Auth/login'

vi.mock('@/Pages/Auth/useLogin', () => ({
  default: () => ({
    loginUserMutation: vi.fn(),
    isPending: false
  })
}))

describe('Login Component', () => {
  test('renders login form with all fields', () => {
    render(<Login />)
    
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument()
  })


  test('allows typing in form fields', async () => {
    render(<Login />)
    const user = userEvent.setup()
    
    const emailInput = screen.getByPlaceholderText(/email/i)
    const passwordInput = screen.getByPlaceholderText(/password/i)

    await user.type(emailInput, 'test@example.com')
    await user.type(passwordInput, 'password123')

    expect(emailInput).toHaveValue('test@example.com')
    expect(passwordInput).toHaveValue('password123')
  })
}) 