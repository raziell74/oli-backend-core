import { ObjectId } from 'mongodb';
import { ApolloError } from 'apollo-server-errors';
import User from '../../models/User';
import ROLES from '../../environment/userRoles';
import { checkPermission, Context } from '../../utils/permissions';
import { isValidEmail } from '../../utils/validation';
import UserMutations from '../../resolvers/Mutation';
import { CreateUserData, UpdateUserData } from '../../resolvers/mutations/User';

// Mock the checkPermission, isValidEmail, and User functions
jest.mock('../../utils/permissions');
jest.mock('../../utils/validation');
jest.mock('../../models/User');

const { createUser, updateUser, deleteUser } = UserMutations;

// Create mock data
const mockContext: Context = {
  ip: '127.0.0.1',
  authUserId: 'some-user-id',
};

const mockUserData: CreateUserData = {
  username: 'testuser1',
  password: 'password',
  firstName: 'Test',
  lastName: 'User',
  email: 'test1@example.com',
  roles: [ROLES.ADMIN],
};

const mockUpdateData: UpdateUserData = {
  firstName: 'Updated',
  lastName: 'User',
  email: 'updated@test.com',
};

const mockUserId = '61234cb34cbc95c6acd3d123';

const mockUser = new User({
  ...mockUserData,
  _id: new ObjectId(mockUserId),
});

// Set up test cases
describe('UserMutations', () => {
  beforeEach(() => {
    (checkPermission as jest.Mock).mockClear();
    (isValidEmail as jest.Mock).mockClear();
    (User.findOne as jest.Mock).mockClear();
    (User.findByIdAndDelete as jest.Mock).mockClear();
    (User.findByIdAndUpdate as jest.Mock).mockClear();
  });

  describe('createUser', () => {
    test('should create a user when authorized', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (isValidEmail as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(null);
      (User.prototype.save as jest.Mock).mockResolvedValue(mockUser);

      const result = await createUser({}, mockUserData, mockContext);

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
      (isValidEmail as jest.Mock).mockResolvedValue(true);
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: mockUserData.username }, { email: mockUserData.email }],
      });
      expect(result._id).toEqual(mockUser._id);
    });

    test('should throw ApolloError when a username or email that already exists', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (User.findOne as jest.Mock).mockResolvedValue(mockUser);

      // Attempt to create a user with an existing username or email
      await expect(createUser({}, mockUserData, mockContext)).rejects.toThrowError(
        new ApolloError('User with this username or email already exists', 'USER_ALREADY_EXISTS')
      );

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: mockUserData.username }, { email: mockUserData.email }],
      });
    });

    test('should throw ApolloError when an invalid email format is provided', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (isValidEmail as jest.Mock).mockReturnValue(false);
      (User.findOne as jest.Mock).mockResolvedValue(null);

      const invalidEmailUserData = {
        ...mockUserData,
        email: 'invalid-email-format',
      };

      // Attempt to create a user with an invalid email format
      await expect(createUser({}, invalidEmailUserData, mockContext)).rejects.toThrowError(
        new ApolloError('Invalid email format', 'INVALID_EMAIL_FORMAT')
      );

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
      expect(isValidEmail).toHaveBeenCalledWith(invalidEmailUserData.email);
      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: invalidEmailUserData.username }, { email: invalidEmailUserData.email }],
      });
    });
  });

  describe('updateUser', () => {
    test('should update a user when authorized', async () => {
      const updatedUser = { ...mockUser.toObject(), ...mockUpdateData };
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (isValidEmail as jest.Mock).mockResolvedValue(true);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(updatedUser);

      const result = await updateUser(
        {},
        { _id: mockUserId, updateData: mockUpdateData },
        mockContext
      );

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.USER]);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith(mockUserId, mockUpdateData, {
        new: true,
      });
      expect(result._id).toEqual(updatedUser._id);
      expect(result.firstName).toEqual(updatedUser.firstName);
      expect(result.lastName).toEqual(updatedUser.lastName);
      expect(result.email).toEqual(updatedUser.email);
    });

    test('should throw ApolloError when an invalid email format is provided during user update', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (isValidEmail as jest.Mock).mockReturnValue(false);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      const invalidEmailUpdateData = {
        ...mockUpdateData,
        email: 'invalid-email-format',
      };

      // Attempt to update a user with an invalid email format
      await expect(
        updateUser({}, { _id: mockUser._id, updateData: invalidEmailUpdateData }, mockContext)
      ).rejects.toThrowError(new ApolloError('Invalid email format', 'INVALID_EMAIL_FORMAT'));

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.USER]);
      expect(isValidEmail).toHaveBeenCalledWith(invalidEmailUpdateData.email);
      expect(User.findByIdAndUpdate).not.toHaveBeenCalled();
    });

    test('should throw ApolloError when the user to be updated is not found', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (isValidEmail as jest.Mock).mockReturnValue(true);
      (User.findByIdAndUpdate as jest.Mock).mockResolvedValue(null);

      // Attempt to update a non-existent user
      await expect(
        updateUser({}, { _id: 'non_existent_user_id', updateData: mockUpdateData }, mockContext)
      ).rejects.toThrowError(new ApolloError('User not found', 'USER_NOT_FOUND'));

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.USER]);
      expect(isValidEmail).toHaveBeenCalledWith(mockUpdateData.email);
      expect(User.findByIdAndUpdate).toHaveBeenCalledWith('non_existent_user_id', mockUpdateData, {
        new: true,
      });
    });
  });

  describe('deleteUser', () => {
    test('should delete a user when authorized', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(mockUser);

      const result = await deleteUser({}, { _id: mockUserId }, mockContext);

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith(mockUserId);
      expect(result._id).toEqual(mockUser._id);
    });

    test('should throw ApolloError when the user to be deleted is not found', async () => {
      (checkPermission as jest.Mock).mockResolvedValue(true);
      (User.findByIdAndDelete as jest.Mock).mockResolvedValue(null);

      // Attempt to delete a non-existent user
      await expect(
        deleteUser({}, { _id: 'non_existent_user_id' }, mockContext)
      ).rejects.toThrowError(new ApolloError('User not found', 'USER_NOT_FOUND'));

      expect(checkPermission).toHaveBeenCalledWith(mockContext.authUserId, [ROLES.ADMIN]);
      expect(User.findByIdAndDelete).toHaveBeenCalledWith('non_existent_user_id');
    });
  });
});
