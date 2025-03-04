export const ERROR_MESSAGES = {
  USER: {
    NOT_FOUND: 'User not found',
    ALREADY_EXISTS: 'User already exists with this email',
    CREATION_FAILED: 'Failed to create user',
    UPDATE_FAILED: 'Failed to update user',
    DELETE_FAILED: 'Failed to delete user',
  },
  ADDRESS: {
    NOT_FOUND: 'Address not found',
    ALREADY_EXISTS: 'User already has an address',
    CREATION_FAILED: 'Failed to create address',
    UPDATE_FAILED: 'Failed to update address',
    DELETE_FAILED: 'Failed to delete address',
  },
  POST: {
    NOT_FOUND: 'Post not found',
    CREATION_FAILED: 'Failed to create post',
    UPDATE_FAILED: 'Failed to update post',
    DELETE_FAILED: 'Failed to delete post',
  },
  VALIDATION: {
    INVALID_INPUT: 'Invalid input data',
  },
  SERVER: {
    INTERNAL_ERROR: 'Internal server error',
    NOT_FOUND: 'Resource not found',
    UNAUTHORIZED: 'Unauthorized access',
  },
};
