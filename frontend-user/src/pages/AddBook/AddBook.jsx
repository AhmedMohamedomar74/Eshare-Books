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
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { createBook, clearMessages } from "../../redux/slices/bookSlice.js";

export default function AddBook() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.books
  );

  const [type, setType] = useState("Sell");
  const [image, setImage] = useState(null);
  const [form, setForm] = useState({
    Title: "",
    Author: "",
    Category: "",
    Price: "",
    Description: "",
  });

  const handleTypeChange = (_, newType) => {
    if (newType) setType(newType);
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    for (const key in form) formData.append(key, form[key]);
    formData.append("Type", type);
    if (type === "Sell") formData.append("Price", form.Price);
    if (image) formData.append("image", image);

    dispatch(createBook(formData));
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
            maxWidth: "700px",
            mx: "auto",
          }}
          component="form"
          onSubmit={handleSubmit}
        >
          <Typography variant="h4" fontWeight={700} textAlign="center" sx={{ mb: 3 }}>
            Add Your Book
          </Typography>

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
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{ mb: 3 }}
            >
              Upload Book Cover
            </Button>
          </label>

          <TextField
            fullWidth
            label="Title"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Author"
            name="Author"
            value={form.Author}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Category"
            name="Category"
            value={form.Category}
            onChange={handleChange}
            sx={{ mb: 2 }}
          />

          {type === "Sell" && (
            <TextField
              fullWidth
              label="Price"
              name="Price"
              type="number"
              value={form.Price}
              onChange={handleChange}
              sx={{ mb: 2 }}
            />
          )}

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="Description"
            value={form.Description}
            onChange={handleChange}
          />

          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{ mt: 3 }}
          >
            <ToggleButton value="Sell">Sell</ToggleButton>
            <ToggleButton value="Donate">Donate</ToggleButton>
            <ToggleButton value="Borrow">Borrow</ToggleButton>
          </ToggleButtonGroup>

          {loading && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          {successMessage && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {successMessage}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.3 }}
          >
            Add Book
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
