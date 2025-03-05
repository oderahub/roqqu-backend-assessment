import Joi from 'joi';

export const createAddressSchema = Joi.object({
  street: Joi.string().trim().min(2).max(100).required().messages({
    'string.empty': 'Street is required',
    'string.min': 'Street must be at least 2 characters long',
    'string.max': 'Street must be at most 100 characters long',
    'any.required': 'Street is required',
  }),
  city: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'City is required',
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City must be at most 50 characters long',
    'any.required': 'City is required',
  }),
  state: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'State is required',
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State must be at most 50 characters long',
    'any.required': 'State is required',
  }),
  country: Joi.string().trim().min(2).max(50).required().messages({
    'string.empty': 'Country is required',
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country must be at most 50 characters long',
    'any.required': 'Country is required',
  }),
  zipCode: Joi.alternatives()
    .try(
      Joi.string()
        .pattern(/^\d{4,10}$/)
        .messages({
          'string.pattern.base': 'Zip Code must be a number with 4-10 digits',
        }),
      Joi.number().min(1000).max(9999999999), // Allow number format
    )
    .required()
    .messages({
      'any.required': 'Zip Code is required',
    }),
});

export const updateAddressSchema = Joi.object({
  street: Joi.string().trim().min(2).max(100).messages({
    'string.min': 'Street must be at least 2 characters long',
    'string.max': 'Street must be at most 100 characters long',
  }),
  city: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'City must be at least 2 characters long',
    'string.max': 'City must be at most 50 characters long',
  }),
  state: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'State must be at least 2 characters long',
    'string.max': 'State must be at most 50 characters long',
  }),
  country: Joi.string().trim().min(2).max(50).messages({
    'string.min': 'Country must be at least 2 characters long',
    'string.max': 'Country must be at most 50 characters long',
  }),
  zipCode: Joi.alternatives().try(
    Joi.string()
      .pattern(/^\d{4,10}$/)
      .messages({
        'string.pattern.base': 'Zip Code must be a number with 4-10 digits',
      }),
    Joi.number().min(1000).max(9999999999),
  ),
}).min(1);

export const addressIdSchema = Joi.object({
  userId: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'Invalid User ID format',
    'any.required': 'User ID is required',
  }),
});
