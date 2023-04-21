// resolvers/queries/User.ts
import User from '../../models/User';
import ROLES from '../../environment/userRoles';
import { checkPermission, Context } from '../../utils/permissions';

type FindUsersInput = {
  _id?: string;
  username?: string;
  email?: string;
  roles?: string;
};

const UserQueries = {
  users: async (_parent: object, { input }: { input: FindUsersInput }, { authUserId }: Context) => {
    await checkPermission(authUserId, [ROLES.ADMIN]);
    return await User.find(input);
  },
};

export default UserQueries;
