import request from 'supertest';
import express from 'express';
import { taskRouter } from '../../routes/taskRouter';
import { taskService } from '../../services';
import { mockUser, mockTask, mockToken } from '../utils/mocks';

jest.mock('../../services/task.service');
jest.mock('../../utils/checkAuth', () => ({
  checkAuth: (req, _res, next) => {
    req.user = mockUser;
    next();
  }
}));

const app = express();
app.use(express.json());
app.use('/tasks', taskRouter);

describe('Task Routes', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /tasks', () => {
    it('should get all tasks for user', async () => {
      (taskService.getTasks as jest.Mock).mockResolvedValueOnce([mockTask]);

      const response = await request(app)
        .get('/tasks')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('tasks');
      expect(response.body.tasks).toHaveLength(1);
    });
  });

  describe('POST /tasks/create', () => {
    it('should create a new task', async () => {
      (taskService.createTask as jest.Mock).mockResolvedValueOnce(mockTask);

      const response = await request(app)
        .post('/tasks/create')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          title: 'Test Task',
          status: 'TODO'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('task');
    });
  });

  describe('PATCH /tasks', () => {
    it('should update a task', async () => {
      (taskService.updateTask as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .patch('/tasks')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          taskId: mockTask.uuid,
          title: 'Updated Task',
          status: 'IN_PROGRESS'
        });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task updated successfully');
    });
  });

  describe('DELETE /tasks/:taskId', () => {
    it('should delete a task', async () => {
      (taskService.deleteTask as jest.Mock).mockResolvedValueOnce(true);

      const response = await request(app)
        .delete(`/tasks/${mockTask.uuid}`)
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Task deleted successfully');
    });
  });
}); 