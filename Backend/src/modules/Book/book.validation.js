import Joi from "joi";
import mongoose from "mongoose";

const objectId = (value, helpers) => {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return helpers.message("Invalid categoryId");
  }
  return value;
};

export const BookValidation = Joi.object({
  Title: Joi.string().required().trim(),
  Description: Joi.string().allow("").optional(),
  categoryId: Joi.string().custom(objectId).required(),
  Price: Joi.number().min(0).required(),
});
