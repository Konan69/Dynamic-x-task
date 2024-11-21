import { describe, expect, test, vi } from 'vitest'
import { render, screen, waitFor } from '../test-utils'
import { CreateTask } from '@/components/Modals/Create-task'
import userEvent from '@testing-library/user-event'

// Mock all required hooks from useTodo
vi.mock('@/Pages/todo/useTodo', () => ({
  useGetTasks: () => ({
    data: [],
    isLoading: false,
    isError: false
  }),
  useCreateTask: () => ({
    mutate: vi.fn((data, { onSuccess }) => {
      // Simulate successful creation
      onSuccess?.()
    })
  }),
  useUpdateTask: () => ({
    updateTaskMutation: vi.fn()
  }),
  useDeleteTask: () => ({
    deleteTaskMutation: vi.fn()
  })
}))

describe('CreateTask Modal', () => {
  test('opens modal when create task button is clicked', async () => {
    const user = userEvent.setup()
    render(<CreateTask />)
    
    await user.click(screen.getByText('Create Task'))
    
    expect(screen.getByText('Create A New Task')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter task title')).toBeInTheDocument()
  })

  test('handles task creation with valid data', async () => {
    const user = userEvent.setup()
    render(<CreateTask />)
    
    // Open modal
    await user.click(screen.getByText('Create Task'))
    
    // Fill form
    await user.type(screen.getByPlaceholderText('Enter task title'), 'New Task')
    await user.click(screen.getByRole('button', { name: /create/i }))
    
    // Modal should close after successful creation
    await waitFor(() => {
      expect(screen.queryByText('Create A New Task')).not.toBeInTheDocument()
    })
  })

  test('validates required fields', async () => {
    const user = userEvent.setup()
    render(<CreateTask />)
    
    await user.click(screen.getByText('Create Task'))
    
    // Try to submit without title
    const createButton = screen.getByRole('button', { name: /create/i })
    expect(createButton).toHaveStyle({ opacity: '0.5' })
    expect(createButton).toBeDisabled()
  })
}) 