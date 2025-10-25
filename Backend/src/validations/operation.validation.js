import Joi from "joi";
import { operationStatusEnum, operationTypeEnum } from "../enum.js";

export const createOperationSchema = Joi.object({
  user_src: Joi.string().required().messages({
    "any.required": "user_src is required",
  }),
  user_dest: Joi.string().allow(null, "").optional(),
  book_id: Joi.string().required().messages({
    "any.required": "book_id is required",
  }),
  operationType: Joi.string()
    .valid(...Object.values(operationTypeEnum))
    .required()
    .messages({
      "any.only": `operationType must be one of: ${Object.values(
        operationTypeEnum
      ).join(", ")}`,
    }),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
}).custom((value, helpers) => {
  const { operationType, startDate, endDate, user_dest } = value;

  // BORROW validation
  if (operationType === operationTypeEnum.BORROW) {
    if (!startDate || !endDate)
      return helpers.error("any.invalid", {
        message: "startDate and endDate are required for borrowing.",
      });
    if (new Date(endDate) <= new Date(startDate))
      return helpers.error("any.invalid", {
        message: "endDate must be after startDate.",
      });
  }

  // EXCHANGE validation
  if (operationType === operationTypeEnum.EXCHANGE && !user_dest) {
    return helpers.error("any.invalid", {
      message: "user_dest is required for exchange operation.",
    });
  }

  // DONATE validation
  if (operationType === operationTypeEnum.DONATE) {
    if (startDate || endDate)
      return helpers.error("any.invalid", {
        message: "startDate and endDate are not allowed for donation.",
      });
  }

  return value;
});

export const updateOperationSchema = Joi.object({
  status: Joi.string()
    .valid(...Object.values(operationStatusEnum))
    .required()
    .messages({
      "any.only": `status must be one of: ${Object.values(
        operationStatusEnum
      ).join(", ")}`,
    }),
});
