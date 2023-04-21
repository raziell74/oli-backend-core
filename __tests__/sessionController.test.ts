import request from 'supertest';
import app from './expressTestHelper';
import sessionStatus from '../controllers/sessionController';
import User, { IUser } from '../models/User';
import dbTestHelper from './dbTestHelper';
import jwt from 'jsonwebtoken';
import env from '../environment/constants';

const userData: IUser = new User({
  username: 'testUser',
  email: 'test@example.com',
  firstName: 'Test',
  lastName: 'User',
  password: 'testPassword',
});

let token: string;

describe('sessionController', () => {
  beforeAll(async () => {
    app.get('/api/session-status', sessionStatus);

    await dbTestHelper.connect();
    await User.deleteMany({});
    await User.create(userData);
    token = jwt.sign({ userId: userData._id }, env.secret, { expiresIn: '4h' });
  });

  afterAll(async () => {
    await dbTestHelper.closeDatabase();
  });

  test('should return expiresIn for valid token', async () => {
    const response = await request(app)
      .get('/api/session-status')
      .set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('expiresIn');
  });

  test('should return an error for expired token', async () => {
    const expiredToken = jwt.sign({ userId: userData._id }, env.secret, { expiresIn: '-1s' });

    const response = await request(app)
      .get('/api/session-status')
      .set('Authorization', `Bearer ${expiredToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Session has expired.' });
  });

  test('should return an error for invalid token', async () => {
    const invalidToken = token.substring(0, token.length - 1) + 'x';

    const response = await request(app)
      .get('/api/session-status')
      .set('Authorization', `Bearer ${invalidToken}`);

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'Invalid token.' });
  });

  test('should return an error if no token is provided', async () => {
    const response = await request(app).get('/api/session-status');

    expect(response.status).toBe(401);
    expect(response.body).toEqual({ message: 'No token provided.' });
  });
});
