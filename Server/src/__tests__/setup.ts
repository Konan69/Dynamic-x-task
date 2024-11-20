import { AppDataSource } from '../db';

beforeAll(async () => {
  // Initialize the test database connection
  await AppDataSource.initialize();
});

afterAll(async () => {
  // Close the database connection after tests
  await AppDataSource.destroy();
}); 