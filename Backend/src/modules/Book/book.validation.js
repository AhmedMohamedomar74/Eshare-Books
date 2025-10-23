import Joi from "joi";

export const BookValidation = Joi.object({
  ISBN: Joi.string().required().trim(),
  Title: Joi.string().required().trim(),
  Description: Joi.string().allow("").optional(),
  Category: Joi.string().required().trim(),
  Condition: Joi.string().valid("New", "Like New", "Used", "Very Used").default("Used"),
  Price: Joi.number().min(0).required(),
});
