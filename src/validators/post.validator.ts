import Joi from 'joi';

export const createPostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).required().messages({
    'string.empty': 'Title is required',
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must be at most 100 characters long',
    'any.required': 'Title is required',
  }),
  body: Joi.string().trim().min(10).required().messages({
    'string.empty': 'Body is required',
    'string.min': 'Body must be at least 10 characters long',
    'any.required': 'Body is required',
  }),
});

export const updatePostSchema = Joi.object({
  title: Joi.string().trim().min(3).max(100).messages({
    'string.min': 'Title must be at least 3 characters long',
    'string.max': 'Title must be at most 100 characters long',
  }),
  body: Joi.string().trim().min(10).messages({
    'string.min': 'Body must be at least 10 characters long',
  }),
}).min(1); // Ensures at least one field is updated

export const postIdSchema = Joi.object({
  id: Joi.string().guid({ version: 'uuidv4' }).required().messages({
    'string.guid': 'Invalid Post ID format',
    'any.required': 'Post ID is required',
  }),
});
