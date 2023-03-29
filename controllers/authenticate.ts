import { Request, Response } from 'express';
import { ResBody } from '../types/restApi';

/**
 * Authentication endpoints
 * Provides RESTful api endpoints to authenticate
 * API connections through jwt tokens
 */

export const authenticate = async (req: Request, res: Response) => {
  const payload: ResBody = {
    responseCode: 200,
    responseType: 'success',
    body: {},
  };

  res.status(payload.responseCode).send(payload);
};

export const checkSession = async (req: Request, res: Response) => {
  const payload: ResBody = {
    responseCode: 200,
    responseType: 'success',
    body: {},
  };

  res.status(payload.responseCode).send(payload);
};
