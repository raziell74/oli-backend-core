// controllers/sessionController.ts
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import env from '../environment/constants';

interface JwtPayload {
  userId: string;
  iat: number;
  exp: number;
}

const sessionStatus = (req: Request, res: Response) => {
  const token = req.header('Authorization')?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  jwt.verify(token, env.secret, (err, result) => {
    if (err?.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Session has expired.' });
    } else if (err) {
      return res.status(401).json({ message: 'Invalid token.' });
    }

    const decodedPayload = result as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedPayload.exp - currentTime;
    res.json({ expiresIn: timeLeft });
  });
};

export default sessionStatus;
