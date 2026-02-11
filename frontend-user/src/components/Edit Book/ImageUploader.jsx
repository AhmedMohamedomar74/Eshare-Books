import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useSelector } from "react-redux";

const ImageUploader = ({
  existingImage,
  image,
  fieldError,
  handleImageUpload,
}) => {
  const { content } = useSelector((state) => state.lang);

  // Determine which image to show
  const imageToShow = image ? URL.createObjectURL(image) : existingImage;

  return (
    <Box sx={{ mb: 3 }}>
      {/* Current/Selected Image Preview */}
      {imageToShow && (
        <Box
          sx={{
            position: "relative",
            width: "100%",
            maxWidth: 300,
            mx: "auto",
            mb: 2,
          }}
        >
          <Box
            component="img"
            src={imageToShow}
            alt={content.bookCoverPreview}
            sx={{
              width: "100%",
              height: "auto",
              maxHeight: 400,
              objectFit: "cover",
              borderRadius: 2,
              boxShadow: 2,
            }}
          />

          {/* Remove/Change Badge */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              right: 8,
              bgcolor: "rgba(0, 0, 0, 0.6)",
              color: "white",
              px: 1.5,
              py: 0.5,
              borderRadius: 1,
              fontSize: "0.75rem",
              fontWeight: "medium",
            }}
          >
            {image ? content.newImage : content.currentImage}
          </Box>
        </Box>
      )}

      {/* Upload Button */}
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
          sx={{
            py: 2,
            fontSize: "1rem",
          }}
        >
          {image
            ? `${content.changeImage} (${image.name})`
            : existingImage
            ? content.changeBookCover
            : content.uploadBookCover}
        </Button>
      </label>

      {/* Error Message */}
      {fieldError && (
        <Typography
          variant="body2"
          color="error"
          sx={{ mt: 1, textAlign: "center" }}
        >
          {fieldError}
        </Typography>
      )}

      {/* Help Text */}
      {!fieldError && (
        <Typography
          variant="caption"
          color="text.secondary"
          display="block"
          textAlign="center"
          sx={{ mt: 1 }}
        >
          {image
            ? content.chooseDifferentImage
            : existingImage
            ? content.keepCurrentImage
            : content.uploadImageHelp}
        </Typography>
      )}
    </Box>
  );
};

export default ImageUploader;