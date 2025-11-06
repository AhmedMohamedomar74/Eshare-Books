import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Grid,
  Alert,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function AddBook() {
  const [type, setType] = useState("Sell");
  const [image, setImage] = useState(null);

  const handleTypeChange = (event, newType) => {
    if (newType) setType(newType);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(URL.createObjectURL(file));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("✅ Book added successfully!");
  };

  return (
    <Box sx={{ bgcolor: "#f7f9fb", minHeight: "100vh", py: 6 }}>
      <Container maxWidth="md">
        <Paper
          elevation={4}
          sx={{
            p: { xs: 3, sm: 5, md: 6 },
            borderRadius: 4,
            backgroundColor: "white",
            boxShadow: "0px 6px 20px rgba(0,0,0,0.08)",
            maxWidth: "700px",
            mx: "auto",
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          {/* Header */}
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 1, color: "#2e3e51" }}
          >
            Add Your Book
          </Typography>

          <Typography
            variant="body1"
            textAlign="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            Share a book with the community by selling, donating, or lending it.
          </Typography>

          {/* Upload Section */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Book Cover
          </Typography>

          <Box
            sx={{
              border: "2px dashed #d1d5db",
              borderRadius: 3,
              textAlign: "center",
              p: 3,
              mb: 4,
              transition: "0.3s",
              "&:hover": { borderColor: "#3b4d61" },
              bgcolor: "#fafafa",
            }}
          >
            <input
              type="file"
              accept="image/*"
              id="book-cover"
              hidden
              onChange={handleImageUpload}
            />
            <label htmlFor="book-cover" style={{ cursor: "pointer" }}>
              {image ? (
                <Box
                  component="img"
                  src={image}
                  alt="Book Cover Preview"
                  sx={{
                    maxHeight: 200,
                    borderRadius: 2,
                    boxShadow: 2,
                    transition: "0.3s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                />
              ) : (
                <>
                  <CloudUploadIcon sx={{ fontSize: 48, color: "#3b4d61" }} />
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Click to upload or drag & drop
                  </Typography>
                  <Typography variant="caption" color="text.disabled">
                    JPG, PNG, or GIF (max 800×800px)
                  </Typography>
                </>
              )}
            </label>
          </Box>

          {/* Listing Type */}
          <Typography variant="subtitle1" fontWeight={600} sx={{ mb: 1 }}>
            Listing Type
          </Typography>

          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{
              mb: 4,
              "& .MuiToggleButton-root": {
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "#3b4d61",
                borderColor: "#d1d5db",
              },
              "& .Mui-selected": {
                backgroundColor: "#3b4d61",
                color: "white",
                "&:hover": { backgroundColor: "#2e3e51" },
              },
            }}
          >
            <ToggleButton value="Sell">Sell</ToggleButton>
            <ToggleButton value="Donate">Donate</ToggleButton>
            <ToggleButton value="Borrow">Borrow</ToggleButton>
          </ToggleButtonGroup>

          {/* Text Fields */}
          <TextField
            fullWidth
            label="Title"
            placeholder="e.g., The Hitchhiker’s Guide to the Galaxy"
            sx={{ mb: 3 }}
          />

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Author"
                placeholder="e.g., Douglas Adams"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Category"
                placeholder="e.g., Science Fiction"
              />
            </Grid>
          </Grid>

          {type === "Sell" && (
            <TextField
              fullWidth
              label="Price ($)"
              type="number"
              placeholder="$10.00"
              sx={{ mt: 3 }}
            />
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            placeholder="Add a short description about the book..."
            sx={{ mt: 3 }}
          />

          {/* Info Message */}
          <Alert
            severity="info"
            sx={{
              mt: 4,
              borderRadius: 2,
              bgcolor: "#f0f6ff",
              color: "#1e3a8a",
              "& .MuiAlert-icon": { color: "#1e3a8a" },
            }}
          >
            Please note: Your submission will be reviewed to ensure it meets our
            community guidelines.
          </Alert>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{
              mt: 4,
              py: 1.4,
              borderRadius: 3,
              fontWeight: 600,
              textTransform: "none",
              backgroundColor: "#3b4d61",
              "&:hover": { backgroundColor: "#2e3e51" },
            }}
          >
            Add Book
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
