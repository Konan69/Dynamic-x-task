import { render, screen } from '../test-utils'
import { Signup } from '@/Pages/Auth/sign-up'
import { vi } from 'vitest'
import userEvent from '@testing-library/user-event'

vi.mock('@/Pages/Auth/useRegisterUser', () => ({
  default: () => ({
    registerUserMutation: vi.fn(),
    isPending: false
  })
}))

describe('Signup Component', () => {
  it('renders signup form correctly', () => {
    render(<Signup />)
    
    expect(screen.getByText(/Create account/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Email Address/i)).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument()
  })

  it('handles form submission with valid data', async () => {
    const user = userEvent.setup()
    render(<Signup />)

    await user.type(screen.getByPlaceholderText(/Username/i), 'testuser')
    await user.type(screen.getByPlaceholderText(/Email Address/i), 'test@example.com')
    await user.type(screen.getByPlaceholderText(/Confirm Password/i), 'Password123!')
    await user.click(screen.getByRole('button', { name: /Submit/i }))

  })
}) 