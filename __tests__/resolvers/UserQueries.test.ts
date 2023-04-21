/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjectId } from 'mongodb';
import User from '../../models/User';
import ROLES from '../../environment/userRoles';
import { checkPermission, Context } from '../../utils/permissions';
import Query from '../../resolvers/Query';
import { FindUsersInput } from '../../resolvers/queries/User';

// Mock the checkPermission and User.find functions
jest.mock('../../utils/permissions');
jest.mock('../../models/User');

const { users } = Query;

// Create mock data
const mockUsers = [
  {
    _id: new ObjectId(),
    username: 'testuser1',
    email: 'test1@example.com',
    roles: [ROLES.ADMIN],
  },
  {
    _id: new ObjectId(),
    username: 'testuser2',
    email: 'test2@example.com',
    roles: [ROLES.USER],
  },
];

const mockInput: FindUsersInput = {
  username: 'testuser1',
};

const mockContext: Context = {
  ip: '127.0.0.1',
  authUserId: 'some-user-id',
};

// Set up test cases
describe('UserQueries', () => {
  beforeEach(() => {
    (checkPermission as jest.Mock).mockClear();
    (User.find as jest.Mock).mockClear();
  });

  test('should return users when authorized', async () => {
    (checkPermission as jest.Mock).mockResolvedValue(true);
    (User.find as jest.Mock).mockResolvedValue(mockUsers);

    const result = await users({}, { input: mockInput }, mockContext);

    expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
    expect(User.find).toHaveBeenCalledWith(mockInput);
    expect(result).toEqual(mockUsers);
  });

  test('should throw an error when not authorized', async () => {
    const error = new Error('Not authorized');
    (checkPermission as jest.Mock).mockRejectedValue(error);

    await expect(users({}, { input: mockInput }, mockContext)).rejects.toThrowError(error);
  });

  test('should throw an error when User.find() fails', async () => {
    (checkPermission as jest.Mock).mockResolvedValue(true);
    const error = new Error('Database error');
    (User.find as jest.Mock).mockRejectedValue(error);

    await expect(users({}, { input: mockInput }, mockContext)).rejects.toThrowError(error);
  });
});
