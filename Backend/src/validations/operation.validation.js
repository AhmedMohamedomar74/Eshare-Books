import Joi from "joi";
import { operationStatusEnum, operationTypeEnum } from "../enum.js";

export const createOperationSchema = Joi.object({
  user_src: Joi.string().required().messages({
    "any.required": "user_src is required",
  }),
  user_dest: Joi.string().required().messages({
    "any.required": "user_dest is required",
  }),
  book_src_id: Joi.string().optional(),
  book_dest_id: Joi.string().optional(),
  operationType: Joi.string()
    .valid(...Object.values(operationTypeEnum))
    .required(),
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
}).custom((value, helpers) => {
  const {
    operationType,
    startDate,
    endDate,
    user_dest,
    book_src_id,
    book_dest_id,
  } = value;

  // BORROW
  if (operationType === operationTypeEnum.BORROW) {
    if (!book_dest_id)
      return helpers.error("any.invalid", {
        message: "book_dest_id is required for borrow.",
      });
    if (!startDate || !endDate)
      return helpers.error("any.invalid", {
        message: "startDate and endDate are required for borrow.",
      });
    if (new Date(endDate) <= new Date(startDate))
      return helpers.error("any.invalid", {
        message: "endDate must be after startDate.",
      });
  }

  // EXCHANGE
  if (operationType === operationTypeEnum.EXCHANGE) {
    if (!book_src_id || !book_dest_id)
      return helpers.error("any.invalid", {
        message: "Both book_src_id and book_dest_id are required for exchange.",
      });
    if (book_src_id === book_dest_id)
      return helpers.error("any.invalid", {
        message: "Books for exchange must be different.",
      });
  }

  // DONATE
  if (operationType === operationTypeEnum.DONATE) {
    if (!book_src_id)
      return helpers.error("any.invalid", {
        message: "book_src_id is required for donate.",
      });
    if (startDate || endDate)
      return helpers.error("any.invalid", {
        message: "startDate and endDate are not allowed for donate.",
      });
  }

  // BUY
  if (operationType === operationTypeEnum.BUY) {
    if (!book_src_id)
      return helpers.error("any.invalid", {
        message: "book_src_id is required for buy.",
      });
    if (book_dest_id)
      return helpers.error("any.invalid", {
        message: "book_dest_id is not allowed for buy.",
      });
    if (startDate || endDate)
      return helpers.error("any.invalid", {
        message: "startDate and endDate are not allowed for buy.",
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
