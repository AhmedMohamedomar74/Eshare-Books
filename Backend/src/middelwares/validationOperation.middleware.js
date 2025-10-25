import {
  createOperationSchema,
  updateOperationSchema,
} from "../validations/operation.validation.js";

export const validateCreateOperation = (req, res, next) => {
  const { error, value } = createOperationSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  req.validatedBody = value;
  next();
};

export const validateUpdateOperation = (req, res, next) => {
  const { error, value } = updateOperationSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      details: error.details.map((d) => d.message),
    });
  }

  req.validatedBody = value;
  next();
};
