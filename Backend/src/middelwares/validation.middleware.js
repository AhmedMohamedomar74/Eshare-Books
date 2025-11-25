import reportSchema from '../modules/report/report.validation.js';
import suggestCategorySchema from '../modules/suggest-category/suggest-category.validation.js';
import { wishlistSchema } from '../modules/wishlist/wishlist.validation.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { loginSchema, signupSchema, verifyEmailSchema } from '../validations/auth.validation.js';
import {
  changePasswordSchema,
  createUserSchema,
  getUsersSchema,
  updateProfileSchema,
  updateUserSchema,
  userIdSchema,
  userPublicProfileSchema,
} from '../validations/user.validation.js';
import {
  friendIdSchema,
  listFriendRequestsSchema,
  requestIdSchema,
  sendFriendRequestSchema,
} from './../validations/friend-request.validation.js';
// import { changePasswordSchema, createUserSchema, getUsersSchema, updateProfileSchema, updateUserSchema, userIdSchema } from './../validations/user.validation.js';

/**
 * Generic Request Validator
 * Uses Joi to validate request data and returns
 * custom validation messages defined in schema.
 */
export const validateRequest = (schema, source = 'body') => {
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
        errors: messages,
      });
    }

    // Only replace request data if it's not query (query is read-only in some Express versions)
    if (source !== 'query') {
      req[source] = value;
    } else {
      // For query params, merge the validated values back
      Object.keys(value).forEach((key) => {
        req.query[key] = value[key];
      });
    }

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

    // Only replace request data if it's not query
    if (property !== 'query') {
      req[property] = value;
    } else {
      // For query params, merge the validated values back
      Object.keys(value).forEach((key) => {
        req.query[key] = value[key];
      });
    }

    next();
  };
};

// Specific validation middlewares for each route
export const validateSignup = validateRequest(signupSchema, 'body');
export const validateLogin = validateRequest(loginSchema, 'body');
export const validateVerifyEmail = validateRequest(verifyEmailSchema, 'params');
export const validateReport = validateRequest(reportSchema, 'body');
export const validateUserPublicProfile = validateRequest(userPublicProfileSchema, 'params');
export const validateGetUsers = validateRequest(getUsersSchema, 'query');
export const validateUserId = validateRequest(userIdSchema, 'params');
export const validateUpdateUser = validateRequest(updateUserSchema, 'body');
export const validateUpdateProfile = validateRequest(updateProfileSchema, 'body');
export const validateChangePassword = validateRequest(changePasswordSchema, 'body');
export const validateCreateUser = validateRequest(createUserSchema, 'body');

export const validateSendFriendRequest = validateRequest(sendFriendRequestSchema, 'body');
export const validateListFriendRequests = validateRequest(listFriendRequestsSchema, 'query');
export const validateRequestId = validateRequest(requestIdSchema, 'params');
export const validateFriendId = validateRequest(friendIdSchema, 'params');

export const validateWishlist = validateRequest(wishlistSchema, 'body');
export const validateSuggestCategory = validateRequest(suggestCategorySchema, 'body');
