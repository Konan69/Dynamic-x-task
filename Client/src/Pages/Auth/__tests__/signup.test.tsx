// import { describe, expect, test, vi } from 'vitest'
// import { render, screen } from '@testing-library/react'
// import { Signup } from '../sign-up'
// import { BrowserRouter } from 'react-router-dom'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// const queryClient = new QueryClient()

// vi.mock('../useRegisterUser', () => ({
//   default: () => ({
//     registerUserMutation: vi.fn(),
//     isPending: false
//   })
// }))

// describe('Signup Component', () => {
//   test('renders signup form', () => {
//     render(
//       <QueryClientProvider client={queryClient}>
//         <BrowserRouter>
//           <Signup />
//         </BrowserRouter>
//       </QueryClientProvider>
//     )
    
//     // Check for heading
//     expect(screen.getByText('Create account')).toBeInTheDocument()
    
//     // Check for form fields using name attribute
//     expect(screen.getByRole('textbox', { name: /username/i })).toBeInTheDocument()
//     expect(screen.getByRole('textbox', { name: /email/i })).toBeInTheDocument()
    
//     // For password fields, use getAllByLabelText or check by name attribute
//     // const passwordInputs = screen.getAllByPlaceholderText(/password/i)
//     // expect(passwordInputs).toHaveLength(2) // We expect two password fields
    
//     // Check submit button
//     expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
//   })
// }) 