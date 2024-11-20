export const mockUser = {
  uuid: '123e4567-e89b-12d3-a456-426614174000',
  username: 'testuser',
  email: 'test@example.com',
  password: '$2b$10$somehashedpassword',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

export const mockTask = {
  uuid: '123e4567-e89b-12d3-a456-426614174001',
  title: 'Test Task',
  status: 'TODO',
  user: mockUser,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null
};

export const mockToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'; 