// import reportSchema from '../modules/report/report.validation.js';
// import { asyncHandler } from '../utils/asyncHandler.js';
// import {
//   loginSchema,
//   signupSchema,
//   updateProfileSchema,
//   verifyEmailSchema,
// } from '../validations/user.validation.js';

// export const validationMiddleware = (schema, property = 'body') => {
//   return (req, res, next) => {
//     const { error } = schema.validate(req[property], { abortEarly: false });

//     if (error) {
//       return res.status(400).json({
//         errors: error.details.map((err) => err.message),
//       });
//     }

//     next();
//   };
// };

// export const validateRequest = (schema, source = 'body') => {
//   return asyncHandler(async (req, res, next) => {
//     const dataToValidate = req[source];

//     // Validate the data
//     const { error, value } = schema.validate(dataToValidate, {
//       abortEarly: false, // Return all errors, not just the first one
//       stripUnknown: true, // Remove unknown fields
//       allowUnknown: false, // Don't allow unknown fields
//     });

//     if (error) {
//       // Format validation errors
//       const validationErrors = error.details.map((detail) => ({
//         field: detail.path.join('.'),
//         message: detail.message,
//       }));

//       // Create a validation error
//       const validationError = new Error('Validation failed');
//       validationError.name = 'ValidationError';
//       validationError.errors = validationErrors;
//       validationError.cause = 400;

//       console.log({ error });
//       return next(validationError);
//     }

//     // Replace the request data with validated and sanitized data
//     req[source] = value;
//     next();
//   });
// };

// // Specific validation middlewares for different routes
// export const validateSignup = validateRequest(signupSchema, 'body');
// export const validateLogin = validateRequest(loginSchema, 'body');
// export const validateUpdateProfile = validateRequest(updateProfileSchema, 'body');
// export const validateVerifyEmail = validateRequest(verifyEmailSchema, 'params');
// export const validateReport = validateRequest(reportSchema, 'body');
import reportSchema from '../modules/report/report.validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  loginSchema,
  signupSchema,
  updateProfileSchema,
  verifyEmailSchema,
} from '../validations/user.validation.js';

/**
 * Generic Request Validator
 * Uses Joi to validate request data and returns
 * custom validation messages defined in schema.
 */
export const validateRequest = (schema, source = 'body') => {
  console.log("Vaildation is running")
  return asyncHandler(async (req, res, next) => {
    const { error, value } = schema.validate(req[source], {
      abortEarly: false, // Show all errors, not just the first
      stripUnknown: true, // Remove unknown fields automatically
      allowUnknown: false, // Disallow extra fields
    });

    if (error) {
      // Extract all error messages
      const messages = error.details.map((detail) => detail.message);

      // Return response directly (instead of using AppError)
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages, // 👈 here are your custom messages
      });
    }

    // Replace request data with validated + sanitized data
    req[source] = value;
    next();
  });
};

/**
 *  Quick wrapper for simple synchronous validation
 */
export const validationMiddleware = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { abortEarly: false });
    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        status: 'error',
        message: 'Validation failed',
        errors: messages,
      });
    }
    req[property] = value;
    next();
  };
};

// Specific validation middlewares for each route




export const validateSignup = validateRequest(signupSchema, 'body');
export const validateLogin = validateRequest(loginSchema, 'body');
export const validateUpdateProfile = validateRequest(updateProfileSchema, 'body');
export const validateVerifyEmail = validateRequest(verifyEmailSchema, 'params');
export const validateReport = validateRequest(reportSchema, 'body');
