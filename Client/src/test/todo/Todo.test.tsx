import { describe, expect, test, vi } from 'vitest'
import { render, screen, within } from '../test-utils'
import { Todo } from '@/Pages/todo/todo'

// Mock all hooks from useTodo
vi.mock('@/Pages/todo/useTodo', () => ({
  useGetTasks: () => ({
    data: [
      { uuid: '1', title: 'Task 1', status: 'Todo' },
      { uuid: '2', title: 'Task 2', status: 'In-Progress' },
      { uuid: '3', title: 'Task 3', status: 'Done' }
    ],
    isLoading: false,
    isError: false
  }),
  useUpdateTask: () => ({
    updateTaskMutation: vi.fn()
  }),
  useDeleteTask: () => ({
    deleteTaskMutation: vi.fn()
  }),
  useCreateTask: () => ({
    mutate: vi.fn()
  })
}))

describe('Todo Component', () => {
  test('renders task board with all columns', () => {
    render(<Todo />)
    expect(screen.getByText('Task Board')).toBeInTheDocument()
  })

  test('displays task stats correctly', () => {
    render(<Todo />)
    
    // Use test IDs to find specific stats
    const totalStats = screen.getByTestId('stats-total').querySelector('p')
    const completedStats = screen.getByTestId('stats-completed').querySelector('p')
    const inProgressStats = screen.getByTestId('stats-in-progress').querySelector('p')
    const todoStats = screen.getByTestId('stats-todo').querySelector('p')

    expect(totalStats).toHaveTextContent('3')
    expect(completedStats).toHaveTextContent('1')
    expect(inProgressStats).toHaveTextContent('1')
    expect(todoStats).toHaveTextContent('1')
  })

  test('renders tasks in correct columns', () => {
    render(<Todo />)
    
    // Find columns by their data-status attribute
    const todoColumn = screen.getByTestId('column-Todo')
    const inProgressColumn = screen.getByTestId('column-In-Progress')
    const doneColumn = screen.getByTestId('column-Done')

    expect(within(todoColumn).getByText('Task 1')).toBeInTheDocument()
    expect(within(inProgressColumn).getByText('Task 2')).toBeInTheDocument()
    expect(within(doneColumn).getByText('Task 3')).toBeInTheDocument()
  })
}) 