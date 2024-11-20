import request from 'supertest';
import express from 'express';
import { authRouter } from '../../routes/authRouter';
import { userService } from '../../services';
import { encryptPassword } from '../../utils/encrypt';
import { comparePassword } from '../../utils/password';
import { mockUser, mockToken } from '../utils/mocks';
import { errorHandlerMiddleware } from '../../middlewares/error.middleware';

jest.mock('../../services/user.service');
jest.mock('../../utils/encrypt');
jest.mock('../../utils/password');
jest.mock('../../utils/generate', () => ({
  generateToken: () => mockToken
}));

// Create Express app with error handling middleware
const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use(errorHandlerMiddleware); // Add error handling middleware

describe('Auth Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /auth/register', () => {
    it('should register a new user successfully', async () => {
      (userService.getOneUser as jest.Mock).mockResolvedValueOnce(null);
      (userService.createUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (encryptPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('user');
    });

    it('should return error if user already exists', async () => {
      (userService.getOneUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (encryptPassword as jest.Mock).mockResolvedValueOnce('hashedPassword');

      const response = await request(app)
        .post('/auth/register')
        .send({
          username: 'testuser',
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(403);
      expect(response.body).toHaveProperty('message', 'User already exists');
    });
  });

  describe('POST /auth/login', () => {
    it('should login user successfully', async () => {
      (userService.getOneUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (comparePassword as jest.Mock).mockResolvedValueOnce(true);
      
      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123'
        });

      expect(response.status).toBe(202);
      expect(response.body).toHaveProperty('token');
      expect(response.body.token).toBe(mockToken);
    });

    it('should return error for invalid credentials - user not found', async () => {
      (userService.getOneUser as jest.Mock).mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'wrong@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });

    it('should return error for invalid credentials - wrong password', async () => {
      (userService.getOneUser as jest.Mock).mockResolvedValueOnce(mockUser);
      (comparePassword as jest.Mock).mockResolvedValueOnce(false);

      const response = await request(app)
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword'
        });

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Invalid credentials');
    });
  });
}); 