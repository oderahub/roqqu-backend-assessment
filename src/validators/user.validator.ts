import Joi from 'joi';

export const createUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'First name is required',
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must be at most 50 characters long',
    'any.required': 'First name is required',
  }),
  lastName: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Last name is required',
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must be at most 50 characters long',
    'any.required': 'Last name is required',
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base':
        'Phone number must be 10-15 digits and can start with + for international format',
    }),
});

export const updateUserSchema = Joi.object({
  firstName: Joi.string().trim().min(2).max(50).messages({
    'string.empty': 'First name cannot be empty',
    'string.min': 'First name must be at least 2 characters long',
    'string.max': 'First name must be at most 50 characters long',
  }),
  lastName: Joi.string().trim().min(2).max(50).messages({
    'string.empty': 'Last name cannot be empty',
    'string.min': 'Last name must be at least 2 characters long',
    'string.max': 'Last name must be at most 50 characters long',
  }),
  email: Joi.string().email().messages({
    'string.email': 'Invalid email format',
  }),
  phoneNumber: Joi.string()
    .pattern(/^\+?[0-9]{10,15}$/)
    .allow(null, '')
    .messages({
      'string.pattern.base':
        'Phone number must be 10-15 digits and can start with + for international format',
    }),
}).min(1);
