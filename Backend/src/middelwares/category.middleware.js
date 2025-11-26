import { AppError } from "../utils/AppError.js";

export const validationMiddleware = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      return next(
        new AppError(error.details.map((err) => err.message).join(", "), 400)
      );
    }

    req.validatedBody = value;
    next();
  };
};
