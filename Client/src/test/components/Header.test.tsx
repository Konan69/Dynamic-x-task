import { describe, expect, test, vi } from 'vitest'
import { render, screen } from '../test-utils'
import { Header } from '@/components/header'
import userEvent from '@testing-library/user-event'

// Mock the user store
vi.mock('@/store/UserStore', () => ({
  default: () => ({
    user: {
      username: 'TestUser'
    }
  })
}))

describe('Header Component', () => {
  test('renders user information correctly', () => {
    render(<Header />)
    
    expect(screen.getByText('TestUser')).toBeInTheDocument()
  })

  test('shows mobile menu button on small screens', () => {
    render(<Header />)
    
    expect(screen.getByRole('button', { name: /toggle menu/i })).toBeInTheDocument()
  })

  test('opens sidebar sheet when menu button is clicked', async () => {
    const user = userEvent.setup()
    render(<Header />)
    
    await user.click(screen.getByRole('button', { name: /toggle menu/i }))
    
    // Check if sidebar content is visible
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })
}) 