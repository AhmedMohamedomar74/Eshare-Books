import React from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";

export default function EditBookImage({
  existingImage,
  image,
  fieldErrors,
  handleImageUpload,
}) {
  const { content } = useSelector((state) => state.lang);

  return (
    <>
      {/* Current Image */}
      {existingImage && !image && (
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography variant="body2" color="text.secondary" mb={1}>
            {content.currentImage}
          </Typography>
          <img
            src={existingImage}
            alt={content.bookCoverAlt}
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
          {image
            ? `${content.newImage}: ${image.name}`
            : content.changeBookCoverOptional}
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