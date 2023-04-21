// __tests__/utils/permissions.test.ts
import { checkPermission } from '../../utils/permissions';
import User from '../../models/User';
import ROLES from '../../environment/userRoles';
import { ApolloError } from 'apollo-server-errors';

// Mock the User model
jest.mock('../../models/User');

describe('utils/permissions', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should throw an ApolloError when the user does not exist', async () => {
    (User.findById as jest.Mock).mockResolvedValue(null);

    await expect(checkPermission('non-existent-user', [ROLES.USER])).rejects.toThrow(
      new ApolloError('Authenticated User does not exist.', 'AUTH_USER_INVALID', {
        _id: 'non-existent-user',
      })
    );
  });

  it('should not throw any error when user has the ADMIN role', async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'admin-user-id',
      roles: [ROLES.ADMIN],
    });

    await expect(checkPermission('admin-user-id', [ROLES.USER])).resolves.not.toThrow();
  });

  it('should not throw any error when user has the required role', async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      roles: [ROLES.USER],
    });

    await expect(checkPermission('user-id', [ROLES.USER])).resolves.not.toThrow();
  });

  it('should throw an ApolloError when user does not have the required role', async () => {
    (User.findById as jest.Mock).mockResolvedValue({
      _id: 'user-id',
      username: 'user-username',
      roles: [ROLES.USER],
    });

    await expect(checkPermission('user-id', [ROLES.ADMIN])).rejects.toThrow(
      new ApolloError(
        'You are not authorized to perform this action.',
        'AUTH_USER_PERMISSION_DENIED',
        {
          checkedForRoles: [ROLES.ADMIN],
          username: 'user-username',
          userRoles: [ROLES.USER],
        }
      )
    );
  });
});
