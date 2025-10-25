import Joi from 'joi';
import { genderEnum, roleEnum } from './../DB/models/User.model.js';

// User signup validation schema
export const signupSchema = Joi.object({
  firstName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'First name is required',
      'string.min': 'First name must be at least 2 characters long',
      'string.max': 'First name cannot exceed 50 characters'
    }),

  secondName: Joi.string()
    .min(2)
    .max(50)
    .required()
    .trim()
    .lowercase()
    .messages({
      'string.empty': 'Second name is required',
      'string.min': 'Second name must be at least 2 characters long',
      'string.max': 'Second name cannot exceed 50 characters'
    }),

  email: Joi.string()
    .email()
    .required()
    .trim()
    .messages({
      'string.email': 'Please provide a valid email address',
      'string.empty': 'Email is required'
    }),

  password: Joi.string()
    .min(6)
    .max(100)
    .required()
    .messages({
      'string.empty': 'Password is required',
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 100 characters'
    }),

  address: Joi.string()
    .optional()
    .allow('')
    .max(255)
    .messages({
      'string.max': 'Address cannot exceed 255 characters'
    }),

  role: Joi.string()
    .valid(...Object.values(roleEnum))
    .default(roleEnum.user)
    .messages({
      'any.only': `Role must be one of: ${Object.values(roleEnum).join(', ')}`
    }),

  // profilePic: Joi.string()
  //   .optional()
  //   .allow('')
  //   .uri()
  //   .messages({
  //     'string.uri': 'Profile picture must be a valid URL'
  //   })
});

// User login validation schema
export const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .trim()
    .lowercase(),


  password: Joi.string()
    .required()
    .messages({
      'string.empty': 'Password is required'
    })
})

// User profile update validation schema
export const updateProfileSchema = Joi.object({
  password: Joi.string()
    .min(6)
    .max(100)
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)'))
    .messages({
      'string.min': 'Password must be at least 6 characters long',
      'string.max': 'Password cannot exceed 100 characters',
      'string.pattern.base': 'Password must contain at least one lowercase letter, one uppercase letter, and one number'
    }),

  DOB: Joi.date()
    .max('now')
    .messages({
      'date.max': 'Date of birth cannot be in the future'
    }),
}).min(1)
  .messages({
    'object.min': 'At least one field must be provided for update'
  });

// Email verification validation schema
export const verifyEmailSchema = Joi.object({
  email: Joi.string()
    .required()
    .messages({
      'string.empty': 'Email token is required'
    })
});