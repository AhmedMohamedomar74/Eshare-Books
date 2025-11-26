import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().trim().required().messages({
    "string.empty": "Category name is required",
  }),
});

export const updateCategorySchema = Joi.object({
  name: Joi.string().trim().optional(),
});
