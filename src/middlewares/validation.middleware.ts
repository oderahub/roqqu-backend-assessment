import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';
import { ERROR_MESSAGES } from '../constants/error.constants';
import { HttpException } from '../utils/http-exception';

export const validate = (schema: Schema, property: 'body' | 'params' | 'query' = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    // Skip validation for GET requests with only params
    if (req.method === 'GET' && property === 'params') {
      return next();
    }
    const { error } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const errorMessage = error.details.map((detail) => detail.message).join(', ');
      return next(new HttpException(400, ERROR_MESSAGES.VALIDATION.INVALID_INPUT, errorMessage));
    }
    next();
  };
};
