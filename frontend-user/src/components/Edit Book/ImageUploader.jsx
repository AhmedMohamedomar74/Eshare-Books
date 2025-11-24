import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const ImageUploader = ({
  existingImage,
  image,
  fieldError,
  handleImageUpload,
}) => {
  return (
    <Box sx={{ mb: 3 }}>
      {/* Current Image Preview */}
      {existingImage && !image && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Current Image:
          </Typography>
          <img
            src={existingImage}
            alt="Current cover"
            style={{
              maxWidth: "200px",
              maxHeight: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        </Box>
      )}

      {/* Upload New Image */}
      <input
        type="file"
        accept="image/*"
        id="book-cover"
        hidden
        onChange={handleImageUpload}
      />
      <label htmlFor="book-cover">
        <Button
          component="span"
          variant={fieldError ? "contained" : "outlined"}
          color={fieldError ? "error" : "primary"}
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ py: 2 }}
        >
          {image ? `New Image: ${image.name}` : "Change Book Cover"}
        </Button>
      </label>

      {/* Error Message */}
      {fieldError && (
        <Typography variant="caption" color="error" display="block" mt={1}>
          {fieldError}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;
