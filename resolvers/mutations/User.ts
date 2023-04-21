// resolvers/mutations/User.ts
import { ApolloError } from 'apollo-server-errors';
import User from '../../models/User';
import { isValidEmail } from '../../utils/validation';
import ROLES from '../../environment/userRoles';
import { checkPermission, Context } from '../../utils/permissions';

export type CreateUserData = {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  roles: string[];
};

export type UpdateUserData = Partial<CreateUserData>;

const UserMutations = {
  createUser: async (_parent: object, args: CreateUserData, { authUserId }: Context) => {
    await checkPermission(authUserId, [ROLES.ADMIN]);

    // Check for existing user
    const { username, email } = args;
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      throw new ApolloError(
        'User with this username or email already exists',
        'USER_ALREADY_EXISTS'
      );
    }

    // Validate Email
    if (!isValidEmail(email)) {
      throw new ApolloError('Invalid email format', 'INVALID_EMAIL_FORMAT');
    }

    // Create User
    const user = new User({ ...args });
    await user.save();
    return user;
  },

  updateUser: async (
    _parent: object,
    { _id, updateData }: { _id: string; updateData: UpdateUserData },
    { authUserId }: Context
  ) => {
    await checkPermission(authUserId, [ROLES.USER]);

    const { email } = updateData;
    if (email && !isValidEmail(email)) {
      throw new ApolloError('Invalid email format', 'INVALID_EMAIL_FORMAT');
    }

    const updatedUser = await User.findByIdAndUpdate(_id, updateData, { new: true });
    if (!updatedUser) {
      throw new ApolloError('User not found', 'USER_NOT_FOUND');
    }
    return updatedUser;
  },

  deleteUser: async (_parent: object, { _id }: { _id: string }, { authUserId }: Context) => {
    await checkPermission(authUserId, [ROLES.ADMIN]);

    const deletedUser = await User.findByIdAndDelete(_id);
    if (!deletedUser) {
      throw new ApolloError('User not found', 'USER_NOT_FOUND');
    }
    return deletedUser;
  },
};

export default UserMutations;
