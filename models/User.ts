import { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';
import { conn_core } from '../environment/connections';
import ROLES from '../environment/userRoles';

export interface IUser extends Document {
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  roles: string[];
  comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  password: { type: String, required: true },
  roles: { type: [String], default: [ROLES.USER] },
});

UserSchema.pre('save', async function (this: IUser, next) {
  if (this.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }
  next();
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = conn_core.model<IUser>('User', UserSchema);

export default User;
