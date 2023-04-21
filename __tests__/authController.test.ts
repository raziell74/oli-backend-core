import request from 'supertest';
import app from './expressTestHelper';
import authenticate from '../controllers/authController';
import User, { IUser } from '../models/User';
import dbTestHelper from './dbTestHelper';

const userData: Partial<IUser> = {
  username: 'testUser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'testPassword',
};

describe('authController', () => {
  beforeAll(async () => {
    app.post('/api/authenticate', authenticate);
    await dbTestHelper.connect();
  });

  afterEach(async () => {
    await dbTestHelper.clearDatabase();
  });

  afterAll(async () => {
    await dbTestHelper.closeDatabase();
  });

  beforeEach(async () => {
    await User.create(userData);
  });

  test('should return an error if no username and password are provided', async () => {
    const response = await request(app).post('/api/authenticate').send({});
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Both Username and Password are required.' });
  });

  test('should return an error if only the password is provided', async () => {
    const response = await request(app)
      .post('/api/authenticate')
      .send({ password: 'testPassword' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Username is required.' });
  });

  test('should return an error if only the username is provided', async () => {
    const response = await request(app).post('/api/authenticate').send({ username: 'testUser' });
    expect(response.status).toBe(400);
    expect(response.body).toEqual({ message: 'Password is required.' });
  });

  test('should return an error if the user is not found', async () => {
    const response = await request(app).post('/api/authenticate').send({
      username: 'nonExistentUser',
      password: 'testPassword',
    });
    expect(response.status).toBe(404);
    expect(response.body).toEqual({ message: 'User not found.' });
  });

  test('should return an error if the password is incorrect', async () => {
    const response = await request(app).post('/api/authenticate').send({
      username: 'testUser',
      password: 'wrongPassword',
    });
    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid password.' });
  });

  test('should return a token if the username and password are correct', async () => {
    const response = await request(app).post('/api/authenticate').send({
      username: 'testUser',
      password: 'testPassword',
    });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });
});
