import React from "react";
import { Box } from "@mui/material";
import EditBookFields from "./EditBookFields";
import EditBookTypeSelector from "./EditBookTypeSelector";
import ImageUploader from "./ImageUploader";

const EditBookForm = ({
  form,
  categories,
  type,
  fieldErrors,
  handleChange,
  validateField,
  handleTypeChange,
  existingImage,
  image,
  handleImageUpload,
}) => {
  return (
    <Box>
      {/* Image Uploader */}
      <ImageUploader
        existingImage={existingImage}
        image={image}
        fieldError={fieldErrors.image}
        handleImageUpload={handleImageUpload}
      />

      {/* Fields */}
      <EditBookFields
        form={form}
        categories={categories}
        type={type}
        fieldErrors={fieldErrors}
        handleChange={handleChange}
        validateField={validateField}
      />

      {/* Type Selector */}
      <EditBookTypeSelector type={type} handleTypeChange={handleTypeChange} />
    </Box>
  );
};

export default EditBookForm;
