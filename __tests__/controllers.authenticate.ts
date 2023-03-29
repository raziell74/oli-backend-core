import { Request, Response } from 'express';
import { authenticate, checkSession } from '../controllers/authenticate';

const mockResponse = () => {
  const res: Partial<Response> = {};
  res.status = jest.fn().mockReturnValue(res);
  res.send = jest.fn().mockReturnValue(res);
  return res as Response;
};

describe('authController', () => {
  test('authenticate should send a success response with status 200', async () => {
    const req = {} as Request;
    const res = mockResponse();

    await authenticate(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      responseCode: 200,
      responseType: 'success',
      body: {},
    });
  });

  test('checkSession should send a success response with status 200', async () => {
    const req = {} as Request;
    const res = mockResponse();

    await checkSession(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith({
      responseCode: 200,
      responseType: 'success',
      body: {},
    });
  });
});
