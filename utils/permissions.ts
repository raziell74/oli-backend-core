// utils/permissions.ts
import { ApolloError } from 'apollo-server-errors';
import User from '../models/User';
import ROLES from '../environment/userRoles';

export interface Context {
  ip: string;
  authUserId: string;
}

/**
 * checkPermission()
 * Checks if a user has a specified role.
 * Throws an ApolloError if it does not
 *
 * @param userId string
 * @param roles string[]
 * @returns void
 */
export const checkPermission = async (userId: string, roles: string[]): Promise<void> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new ApolloError('Authenticated User does not exist.', 'AUTH_USER_INVALID', {
      _id: userId,
    });
  }

  // early exit if user has the ADMIN role. ADMIN's have access to everything
  if (user.roles.includes(ROLES.ADMIN)) return;

  let hasRole = false;
  roles.map((role) => {
    if (user.roles.includes(role)) {
      hasRole = true;
    }
  });

  if (!hasRole) {
    throw new ApolloError(
      'You are not authorized to perform this action.',
      'AUTH_USER_PERMISSION_DENIED',
      {
        checkedForRoles: roles,
        username: user.username,
        userRoles: user.roles,
      }
    );
  }
};
