// user.validation.js
import Joi from 'joi';
import { roleEnum } from '../DB/models/User.model.js';

// Common validation patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$/;
const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

/**
 * Validation Schema for Getting Users (Query Parameters)
 */
export const getUsersSchema = Joi.object({
  page: Joi.number()
    .integer()
    .min(1)
    .default(1)
    .messages({
      'number.base': 'Page must be a number',
      'number.min': 'Page must be at least 1',
    }),
  limit: Joi.number()
    .integer()
    .min(1)
    .max(100)
    .default(10)
    .messages({
      'number.base': 'Limit must be a number',
      'number.min': 'Limit must be at least 1',
      'number.max': 'Limit cannot exceed 100',
    }),
  search: Joi.string()
    .trim()
    .min(1)
    .max(100)
    .optional()
    .messages({
      'string.min': 'Search query must be at least 1 character',
      'string.max': 'Search query cannot exceed 100 characters',
    }),
  role: Joi.string()
    .valid(...Object.values(roleEnum))
    .optional()
    .messages({
      'any.only': `Role must be one of: ${Object.values(roleEnum).join(', ')}`,
    }),
});

/**
 * Validation Schema for User ID Parameter
 */
export const userIdSchema = Joi.object({
  id: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid user ID format',
      'any.required': 'User ID is required',
    }),
});

/**
 * Validation Schema for Updating User (Admin)
 */
export const updateUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  secondName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Second name must be at least 2 characters',
      'string.max': 'Second name cannot exceed 50 characters',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 200 characters',
    }),
  role: Joi.string()
    .valid(...Object.values(roleEnum))
    .optional()
    .messages({
      'any.only': `Role must be one of: ${Object.values(roleEnum).join(', ')}`,
    }),
  profilePic: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Validation Schema for Updating Profile (Current User)
 */
export const updateProfileSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
    }),
  secondName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .optional()
    .messages({
      'string.min': 'Second name must be at least 2 characters',
      'string.max': 'Second name cannot exceed 50 characters',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .optional()
    .messages({
      'string.email': 'Please provide a valid email address',
    }),
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 200 characters',
    }),
  profilePic: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
}).min(1).messages({
  'object.min': 'At least one field must be provided for update',
});

/**
 * Validation Schema for Changing Password
 */
export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string()
    .required()
    .messages({
      'any.required': 'Current password is required',
      'string.empty': 'Current password cannot be empty',
    }),
  newPassword: Joi.string()
    .min(8)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.min': 'New password must be at least 8 characters',
      'string.pattern.base': 'New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'New password is required',
    }),
  confirmPassword: Joi.string()
    .valid(Joi.ref('newPassword'))
    .required()
    .messages({
      'any.only': 'Passwords do not match',
      'any.required': 'Password confirmation is required',
    }),
}).messages({
  'object.unknown': 'Unknown field provided',
});

/**
 * Validation Schema for Creating User (if needed)
 */
export const createUserSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'First name must be at least 2 characters',
      'string.max': 'First name cannot exceed 50 characters',
      'any.required': 'First name is required',
    }),
  secondName: Joi.string()
    .trim()
    .min(2)
    .max(50)
    .required()
    .messages({
      'string.min': 'Second name must be at least 2 characters',
      'string.max': 'Second name cannot exceed 50 characters',
      'any.required': 'Second name is required',
    }),
  email: Joi.string()
    .email()
    .trim()
    .lowercase()
    .required()
    .messages({
      'string.email': 'Please provide a valid email address',
      'any.required': 'Email is required',
    }),
  password: Joi.string()
    .min(8)
    .pattern(passwordPattern)
    .required()
    .messages({
      'string.min': 'Password must be at least 8 characters',
      'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
      'any.required': 'Password is required',
    }),
  address: Joi.string()
    .trim()
    .min(5)
    .max(200)
    .optional()
    .messages({
      'string.min': 'Address must be at least 5 characters',
      'string.max': 'Address cannot exceed 200 characters',
    }),
  role: Joi.string()
    .valid(...Object.values(roleEnum))
    .default('user')
    .messages({
      'any.only': `Role must be one of: ${Object.values(roleEnum).join(', ')}`,
    }),
  profilePic: Joi.string()
    .uri()
    .optional()
    .messages({
      'string.uri': 'Profile picture must be a valid URL',
    }),
});

