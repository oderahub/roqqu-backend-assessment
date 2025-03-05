import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';

declare module 'express' {
  interface Request {
    user?: { id: string };
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    throw new HttpException(401, ERROR_MESSAGES.SERVER.UNAUTHORIZED);
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as {
      id: string;
    };
    req.user = { id: decoded.id };
    next();
  } catch (
    error // eslint-disable-line @typescript-eslint/no-unused-vars
  ) {
    throw new HttpException(401, ERROR_MESSAGES.SERVER.UNAUTHORIZED);
  }
};
