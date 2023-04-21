import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import jwt from 'jsonwebtoken';
import env from '../environment/constants';

interface ILoginRequest {
  username: string;
  password: string;
}

/**
 * Authentication endpoints
 * Provides RESTful api endpoints to authenticate
 * API connections through jwt tokens
 */
const authenticate = async (req: Request, res: Response) => {
  const { username, password }: ILoginRequest = req.body;

  if (!username && !password) {
    return res.status(400).json({ message: 'Both Username and Password are required.' });
  }

  if (!username) {
    return res.status(400).json({ message: 'Username is required.' });
  }

  if (!password) {
    return res.status(400).json({ message: 'Password is required.' });
  }

  const user: IUser | null = await User.findOne({ $or: [{ username }, { email: username }] });

  if (!user) {
    return res.status(404).json({ message: 'User not found.' });
  }

  const isPasswordValid = await user.comparePassword(password);

  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid password.' });
  }

  const token = jwt.sign({ userId: user._id }, env.secret, {
    expiresIn: '4h',
  });

  res.json({ token });
};

export default authenticate;
