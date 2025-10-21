import { asyncHandler } from "../utils/asyncHandler.js";
import { loginSchema, signupSchema, updateProfileSchema, verifyEmailSchema } from "../validations/user.validation.js";

export const validationMiddleware = (schema, property = "body") => {
  return (req, res, next) => {
    const { error } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      return res.status(400).json({
        errors: error.details.map((err) => err.message),
      });
    }

    next();
  };
};


export const validateRequest = (schema, source = 'body') => {
  return asyncHandler(async (req, res, next) => {
    const dataToValidate = req[source];
    
    // Validate the data
    const { error, value } = schema.validate(dataToValidate, {
      abortEarly: false, // Return all errors, not just the first one
      stripUnknown: true, // Remove unknown fields
      allowUnknown: false // Don't allow unknown fields
    });

    if (error) {
      // Format validation errors
      const validationErrors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      // Create a validation error
      const validationError = new Error('Validation failed');
      validationError.name = 'ValidationError';
      validationError.errors = validationErrors;
      validationError.cause = 400

      console.log({error})
      next(validationError)
    }


    // Replace the request data with validated and sanitized data
    req[source] = value;
    next();
  });
};


// Specific validation middlewares for different routes
export const validateSignup = validateRequest(signupSchema, 'body');
export const validateLogin = validateRequest(loginSchema, 'body');
export const validateUpdateProfile = validateRequest(updateProfileSchema, 'body');
export const validateVerifyEmail = validateRequest(verifyEmailSchema, 'params');