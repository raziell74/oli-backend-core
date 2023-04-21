import { Request, Response } from 'express';
import token from '../utilities/token';

const sessionStatus = (req: Request, res: Response) => {
  const jwt = req.header('Authorization')?.split(' ')[1];

  if (!jwt) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  const verifyPayload = token.verify(jwt);
  switch (verifyPayload.message) {
    case 'Valid':
      res.json({ expiresIn: verifyPayload.expiresIn });
      break;
    case 'Expired':
      res.status(401).json({ message: 'Session has expired.' });
      break;
    default:
      res.status(401).json({ message: 'Invalid token.' });
  }
};

export default sessionStatus;
