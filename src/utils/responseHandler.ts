import { Response } from 'express';
//import { HTTP_STATUS } from '../constants/error.constants';

export const sendResponse = <T>(
  res: Response,
  statusCode: number,
  data: T,
  extra?: Record<string, any>,
): void => {
  res.status(statusCode).json({
    status: 'success',
    data,
    ...(extra || {}),
  });
};

export const sendError = (res: Response, statusCode: number, message: string): void => {
  res.status(statusCode).json({
    status: 'error',
    code: statusCode,
    message,
  });
};
