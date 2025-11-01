// friend-request.validation.js
import Joi from 'joi';
import { friendRequestStatusEnum } from '../enum.js';


// Common validation patterns
const objectIdPattern = /^[0-9a-fA-F]{24}$/;

/**
 * Validation Schema for Send Friend Request (Body)
 */
export const sendFriendRequestSchema = Joi.object({
  friendId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid friend ID format',
      'any.required': 'Friend ID is required',
      'string.empty': 'Friend ID cannot be empty',
    }),
});

/**
 * Validation Schema for List Friend Requests (Query Parameters)
 */
export const listFriendRequestsSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(friendRequestStatusEnum))
    .optional()
    .messages({
      'any.only': `Status must be one of: ${Object.values(friendRequestStatusEnum).join(', ')}`,
    }),
});

/**
 * Validation Schema for Request ID Parameter
 */
export const requestIdSchema = Joi.object({
  requestId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid request ID format',
      'any.required': 'Request ID is required',
      'string.empty': 'Request ID cannot be empty',
    }),
});

/**
 * Validation Schema for Friend ID Parameter
 */
export const friendIdSchema = Joi.object({
  friendId: Joi.string()
    .pattern(objectIdPattern)
    .required()
    .messages({
      'string.pattern.base': 'Invalid friend ID format',
      'any.required': 'Friend ID is required',
      'string.empty': 'Friend ID cannot be empty',
    }),
});