import Joi from "joi";
import { operationTypeEnum, operationStatusEnum } from "../enum.js";

export const createOperationSchema = Joi.object({
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
  const { operationType, book_src_id, book_dest_id, startDate, endDate } =
    value;

  switch (operationType) {
    case operationTypeEnum.BORROW:
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
      break;

    case operationTypeEnum.EXCHANGE:
      if (!book_src_id || !book_dest_id)
        return helpers.error("any.invalid", {
          message: "Both books are required for exchange.",
        });
      if (book_src_id === book_dest_id)
        return helpers.error("any.invalid", {
          message: "Books for exchange must be different.",
        });
      break;

    case operationTypeEnum.DONATE:
      if (!book_dest_id)
        return helpers.error("any.invalid", {
          message: "book_dest_id is required for donate.",
        });
      if (startDate || endDate)
        return helpers.error("any.invalid", {
          message: "Dates are not allowed for donate.",
        });
      break;

    case operationTypeEnum.BUY:
      if (!book_dest_id)
        return helpers.error("any.invalid", {
          message: "book_dest_id is required for buy.",
        });
      if (book_src_id)
        return helpers.error("any.invalid", {
          message: "book_src_id not allowed for buy.",
        });
      if (startDate || endDate)
        return helpers.error("any.invalid", {
          message: "Dates are not allowed for buy.",
        });
      break;
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
