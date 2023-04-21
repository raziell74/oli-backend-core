import jwt from 'jsonwebtoken';
import env from '../environment/constants';

type JwtPayload = {
  userId: string;
  iat: number;
  exp: number;
};

type VerifyResponse = {
  userId: string;
  message: string;
  expiresIn: number | null;
};

/**
 * token.verify()
 * Verifies an auth token (JWT) and returns if it's Valid, Expired, or Invalid
 * If Valid the return will include how much longer it has until it expires in seconds
 *
 * @param token string
 * @returns VerifyResponse
 */
const verify = (token: string) => {
  const response: VerifyResponse = { userId: '', message: 'Invalid', expiresIn: null };

  jwt.verify(token, env.secret, (err, result) => {
    if (err?.name === 'TokenExpiredError') {
      response.message = 'Expired';
      return;
    } else if (err) {
      response.message = 'Invalid';
      return;
    }

    const decodedPayload = result as JwtPayload;
    const currentTime = Math.floor(Date.now() / 1000);
    const timeLeft = decodedPayload.exp - currentTime;
    response.message = 'Valid';
    response.expiresIn = timeLeft;
    response.userId = decodedPayload.userId;
    return;
  });

  return response;
};

export default {
  verify,
};
