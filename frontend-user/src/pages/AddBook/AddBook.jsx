import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  Paper,
  Alert,
  CircularProgress,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { useDispatch, useSelector } from "react-redux";
import { createBook, clearMessages } from "../../redux/slices/bookSlice.js";
import bookService from "../../services/book.service.js";

export default function AddBook() {
  const dispatch = useDispatch();
  const { loading, error, successMessage } = useSelector(
    (state) => state.books
  );

  const [type, setType] = useState("toSale");
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    Title: "",
    categoryId: "",
    Price: "",
    PricePerDay: "",
    Description: "",
  });

  const [fieldErrors, setFieldErrors] = useState({
    image: "",
    Title: "",
    categoryId: "",
    Price: "",
    PricePerDay: "",
    Description: "",
  });

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await bookService.getAllCategories();
        setCategories(data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    };
    fetchCategories();

    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setForm({
        Title: "",
        categoryId: "",
        Price: "",
        PricePerDay: "",
        Description: "",
      });
      setImage(null);
      setFieldErrors({
        image: "",
        Title: "",
        categoryId: "",
        Price: "",
        PricePerDay: "",
        Description: "",
      });
      // setType("toSale"); // اختياري
    }
  }, [successMessage]);

  const handleTypeChange = (_, newType) => {
    if (!newType) return;

    setType(newType);
    setForm((prevForm) => ({
      ...prevForm,
      Price: "",
      PricePerDay: "",
    }));
    setFieldErrors((prev) => ({
      ...prev,
      Price: "",
      PricePerDay: "",
    }));
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setFieldErrors((prev) => ({
        ...prev,
        image: "Only image files are allowed",
      }));
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        image: `Image size must be less than ${maxSizeMB}MB`,
      }));
      return;
    }

    setImage(file);
    setFieldErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "Price" || name === "PricePerDay") && Number(value) < 0) {
      setForm((prev) => ({ ...prev, [name]: "" }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "Price cannot be negative",
      }));
      return;
    }

    setForm((prev) => ({ ...prev, [name]: value }));

    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validateField = (name, value) => {
    let errorMsg = "";

    if (name === "Title") {
      if (!value.trim()) errorMsg = "Title is required";
      else if (value.trim().length < 2)
        errorMsg = "Title must be at least 2 characters";
    }

    if (name === "categoryId") {
      if (!value) errorMsg = "Category is required";
    }

    if (name === "Description") {
      if (!value.trim()) errorMsg = "Description is required";
      else if (value.trim().length < 10)
        errorMsg = "Description must be at least 10 characters";
    }

    if (name === "Price" && type === "toSale") {
      if (value === "" || value === null)
        errorMsg = "Price is required for sale";
      else if (Number(value) <= 0)
        errorMsg = "Price must be greater than zero";
    }

    if (name === "PricePerDay" && type === "toBorrow") {
      if (value === "" || value === null)
        errorMsg = "Price per day is required for borrowing";
      else if (Number(value) <= 0)
        errorMsg = "Price per day must be greater than zero";
    }

    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const validateForm = () => {
    const errors = {};

    if (!image) errors.image = "Book cover image is required";

    if (!form.Title.trim()) errors.Title = "Title is required";
    else if (form.Title.trim().length < 2)
      errors.Title = "Title must be at least 2 characters";

    if (!form.categoryId) errors.categoryId = "Category is required";

    if (!form.Description.trim())
      errors.Description = "Description is required";
    else if (form.Description.trim().length < 10)
      errors.Description = "Description must be at least 10 characters";

    if (type === "toSale") {
      if (form.Price === "" || form.Price === null)
        errors.Price = "Price is required for sale";
      else if (Number(form.Price) <= 0)
        errors.Price = "Price must be greater than zero";
    }

    if (type === "toBorrow") {
      if (form.PricePerDay === "" || form.PricePerDay === null)
        errors.PricePerDay = "Price per day is required for borrowing";
      else if (Number(form.PricePerDay) <= 0)
        errors.PricePerDay = "Price per day must be greater than zero";
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const formData = new FormData();
    formData.append("Title", form.Title.trim());
    formData.append("categoryId", form.categoryId);
    formData.append("Description", form.Description.trim());
    formData.append("TransactionType", type);

    if (type === "toSale") formData.append("Price", form.Price);
    if (type === "toBorrow") formData.append("PricePerDay", form.PricePerDay);
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
          noValidate
        >
          <Typography
            variant="h4"
            fontWeight={700}
            textAlign="center"
            sx={{ mb: 3 }}
          >
            Add Your Book
          </Typography>

          {/* 📸 Upload Image */}
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
              sx={{
                mb: 1,
                py: 5,
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {image ? `Selected: ${image.name}` : "Upload Book Cover"}
            </Button>
          </label>

          {fieldErrors.image && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {fieldErrors.image}
            </Typography>
          )}

          {/* 🏷️ Title */}
          <TextField
            fullWidth
            label="Title"
            name="Title"
            value={form.Title}
            onChange={handleChange}
            onBlur={(e) => validateField("Title", e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.Title)}
            helperText={fieldErrors.Title}
          />

          {/* 📂 Category Dropdown */}
          <TextField
            select
            fullWidth
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            onBlur={(e) => validateField("categoryId", e.target.value)}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.categoryId)}
            helperText={fieldErrors.categoryId}
          >
            <option value="" disabled>
              Select category
            </option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </TextField>

          {/* 💰 Price (only if toSale) */}
          {type === "toSale" && (
            <TextField
              fullWidth
              label="Price"
              name="Price"
              type="number"
              value={form.Price}
              onChange={handleChange}
              onBlur={(e) => validateField("Price", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 1 }}
              error={Boolean(fieldErrors.Price)}
              helperText={fieldErrors.Price}
            />
          )}

          {/* 📅 Price Per Day (only if toBorrow) */}
          {type === "toBorrow" && (
            <TextField
              fullWidth
              label="Price Per Day"
              name="PricePerDay"
              type="number"
              value={form.PricePerDay}
              onChange={handleChange}
              onBlur={(e) => validateField("PricePerDay", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 1 }}
              error={Boolean(fieldErrors.PricePerDay)}
              helperText={fieldErrors.PricePerDay}
            />
          )}

          {/* 📝 Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Description"
            name="Description"
            value={form.Description}
            onChange={handleChange}
            onBlur={(e) => validateField("Description", e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.Description)}
            helperText={fieldErrors.Description}
          />

          {/* 🔘 Type Selector */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{ mt: 3 }}
          >
            <ToggleButton value="toSale">Sell</ToggleButton>
            <ToggleButton value="toDonate">Donate</ToggleButton>
            <ToggleButton value="toBorrow">Borrow</ToggleButton>
          </ToggleButtonGroup>

          {/* 🌀 Loading + AI Review Message */}
          {loading && (
            <Alert
              severity="info"
              sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}
            >
              <CircularProgress size={20} />
              Your book is being reviewed by our AI model...
            </Alert>
          )}

          {/* ⚠️ Error */}
          {error && !loading && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* ✅ Success */}
          {successMessage && !loading && (
            <Alert severity="success" sx={{ mt: 3 }}>
              Book added successfully ✅ <br />
              It passed our AI review.
            </Alert>
          )}

          {/* 🚀 Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.3 }}
            disabled={loading}
          >
            Add Book
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
