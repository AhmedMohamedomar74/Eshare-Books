import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function EditBookImage({
  existingImage,
  image,
  fieldErrors,
  handleImageUpload,
}) {
  return (
    <>
      {/* Current Image */}
      {existingImage && !image && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            Current Image:
          </Typography>
          <img
            src={existingImage}
            alt="Book cover"
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
          variant={fieldErrors.image ? "contained" : "outlined"}
          color={fieldErrors.image ? "error" : "primary"}
          startIcon={<CloudUploadIcon />}
          fullWidth
          sx={{ mb: 1, py: 2, fontSize: "1rem" }}
        >
          {image ? `New Image: ${image.name}` : "Change Book Cover (Optional)"}
        </Button>
      </label>

      {fieldErrors.image && (
        <Typography variant="body2" color="error" sx={{ mb: 2 }}>
          {fieldErrors.image}
        </Typography>
      )}
    </>
  );
}
