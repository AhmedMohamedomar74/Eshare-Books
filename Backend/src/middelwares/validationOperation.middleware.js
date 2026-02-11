import { AppError } from "../utils/AppError.js";
import {
  createOperationSchema,
  updateOperationSchema,
} from "../validations/operation.validation.js";

export const validateCreateOperation = (req, res, next) => {
  const { error, value } = createOperationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  req.validatedBody = value;
  next();
};

export const validateUpdateOperation = (req, res, next) => {
  const { error, value } = updateOperationSchema.validate(req.body);

  if (error) {
    return next(
      new AppError(error.details.map((d) => d.message).join(", "), 400)
    );
  }

  req.validatedBody = value;
  next();
};
