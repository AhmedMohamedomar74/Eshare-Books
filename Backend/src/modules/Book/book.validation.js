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
  // ✅ يجب إضافة نوع المعاملة للتحقق
  TransactionType: Joi.string().valid("toSale", "toBorrow", "toDonate").required(),

  // ✅ السعر مطلوب فقط إذا كان نوع المعاملة "للبيع"
  Price: Joi.number().min(0).when('TransactionType', {
    is: 'toSale',
    then: Joi.required(),
    otherwise: Joi.optional().allow(null, 0), // اختياري في الحالات الأخرى
  }),

  // ✅ سعر اليوم مطلوب فقط إذا كان نوع المعاملة "للاستعارة"
  PricePerDay: Joi.number().min(0).when('TransactionType', {
    is: 'toBorrow',
    then: Joi.required(),
    otherwise: Joi.optional().allow(null, 0), // اختياري في الحالات الأخرى
  }),
});
