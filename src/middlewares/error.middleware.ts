import { Request, Response, NextFunction } from 'express';
import { HttpException } from '../utils/http-exception';
import { ERROR_MESSAGES } from '../constants/error.constants';
import { logger as log } from '../utils/logger';

// Define the error-handling middleware signature explicitly
export const errorMiddleware = (
  error: Error | HttpException,
  req: Request,
  res: Response,
  next: NextFunction, // eslint-disable-line @typescript-eslint/no-unused-vars
): void => {
  try {
    if (error instanceof HttpException) {
      log.error(`[${error.status}] ${error.message}`);

      res.status(error.status).json({
        status: 'error',
        code: error.status,
        message: error.message,
      });
    } else {
      // For unhandled errors
      log.error(`[500] ${error.message}`);

      res.status(500).json({
        status: 'error',
        code: 500,
        message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      });
    }
  } catch (err) {
    // Fallback error handler
    log.error(`Error in error middleware: ${err}`);
    res.status(500).json({
      status: 'error',
      code: 500,
      message: ERROR_MESSAGES.SERVER.INTERNAL_ERROR,
    });
  }
};
