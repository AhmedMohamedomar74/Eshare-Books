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
import SuggestCategoryButton from "../../components/SuggestCategoryComponents/SuggestCategoryButton.jsx";
import useTranslate from "../../hooks/useTranslate";
import { useNavigate } from "react-router-dom"; // ✅ NEW

// ✅ Max limits
const MAX_SALE_PRICE = 100000;
const MAX_BORROW_PRICE_PER_DAY = 500;

export default function AddBook() {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // ✅ NEW
  const { loading, error, successMessage } = useSelector((state) => state.books);

  const { t } = useTranslate();

  const [type, setType] = useState("toSale");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
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

  // ✅ cleanup preview URL on image change/unmount
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  // ✅ reset after success + redirect
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

      if (imagePreview) URL.revokeObjectURL(imagePreview);
      setImagePreview(null);

      setFieldErrors({
        image: "",
        Title: "",
        categoryId: "",
        Price: "",
        PricePerDay: "",
        Description: "",
      });

      // ✅ Redirect to profile after success
      navigate("/profile");
    }
  }, [successMessage, navigate]); // ✅ keep navigate in deps

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
        image: t("onlyImagesAllowed", "Only image files are allowed"),
      }));
      return;
    }

    const maxSizeMB = 5;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setFieldErrors((prev) => ({
        ...prev,
        image: t("imageTooLarge", `Image size must be less than ${maxSizeMB}MB`),
      }));
      return;
    }

    setImage(file);
    setFieldErrors((prev) => ({ ...prev, image: "" }));

    if (imagePreview) URL.revokeObjectURL(imagePreview);
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if ((name === "Price" || name === "PricePerDay") && Number(value) < 0) {
      setForm((prev) => ({ ...prev, [name]: "" }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: t("priceNegative", "Price cannot be negative"),
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
      if (!value.trim()) errorMsg = t("titleRequired", "Title is required");
      else if (value.trim().length < 2)
        errorMsg = t("titleTooShort", "Title must be at least 2 characters");
    }

    if (name === "categoryId") {
      if (!value) errorMsg = t("categoryRequired", "Category is required");
    }

    if (name === "Description") {
      if (!value.trim())
        errorMsg = t("descriptionRequired", "Description is required");
      else if (value.trim().length < 10)
        errorMsg = t(
          "descriptionTooShort",
          "Description must be at least 10 characters"
        );
    }

    if (name === "Price" && type === "toSale") {
      if (value === "" || value === null)
        errorMsg = t("priceRequired", "Price is required for sale");
      else if (Number(value) <= 0)
        errorMsg = t("priceMustBePositive", "Price must be greater than zero");
      else if (Number(value) > MAX_SALE_PRICE)
        errorMsg = t(
          "priceMaxSale",
          `Price must be less than or equal to ${MAX_SALE_PRICE}`
        );
    }

    if (name === "PricePerDay" && type === "toBorrow") {
      if (value === "" || value === null)
        errorMsg = t(
          "pricePerDayRequired",
          "Price per day is required for borrowing"
        );
      else if (Number(value) <= 0)
        errorMsg = t(
          "pricePerDayMustBePositive",
          "Price per day must be greater than zero"
        );
      else if (Number(value) > MAX_BORROW_PRICE_PER_DAY)
        errorMsg = t(
          "priceMaxBorrow",
          `Price per day must be less than or equal to ${MAX_BORROW_PRICE_PER_DAY}`
        );
    }

    setFieldErrors((prev) => ({ ...prev, [name]: errorMsg }));
    return errorMsg === "";
  };

  const validateForm = () => {
    const errors = {};

    if (!image)
      errors.image = t("bookCoverRequired", "Book cover image is required");

    if (!form.Title.trim())
      errors.Title = t("titleRequired", "Title is required");
    else if (form.Title.trim().length < 2)
      errors.Title = t("titleTooShort", "Title must be at least 2 characters");

    if (!form.categoryId)
      errors.categoryId = t("categoryRequired", "Category is required");

    if (!form.Description.trim())
      errors.Description = t("descriptionRequired", "Description is required");
    else if (form.Description.trim().length < 10)
      errors.Description = t(
        "descriptionTooShort",
        "Description must be at least 10 characters"
      );

    if (type === "toSale") {
      if (form.Price === "" || form.Price === null)
        errors.Price = t("priceRequired", "Price is required for sale");
      else if (Number(form.Price) <= 0)
        errors.Price = t("priceMustBePositive", "Price must be greater than zero");
      else if (Number(form.Price) > MAX_SALE_PRICE)
        errors.Price = t(
          "priceMaxSale",
          `Price must be less than or equal to ${MAX_SALE_PRICE}`
        );
    }

    if (type === "toBorrow") {
      if (form.PricePerDay === "" || form.PricePerDay === null)
        errors.PricePerDay = t(
          "pricePerDayRequired",
          "Price per day is required for borrowing"
        );
      else if (Number(form.PricePerDay) <= 0)
        errors.PricePerDay = t(
          "pricePerDayMustBePositive",
          "Price per day must be greater than zero"
        );
      else if (Number(form.PricePerDay) > MAX_BORROW_PRICE_PER_DAY)
        errors.PricePerDay = t(
          "priceMaxBorrow",
          `Price per day must be less than or equal to ${MAX_BORROW_PRICE_PER_DAY}`
        );
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
            {t("addNewBook", "Add Your Book")}
          </Typography>

          {/* ✅ Upload Image */}
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
              startIcon={!imagePreview ? <CloudUploadIcon /> : null}
              fullWidth
              sx={{
                mb: 1,
                py: imagePreview ? 1 : 5,
                minHeight: 220,
                fontSize: "1rem",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 1,
                overflow: "hidden",
              }}
            >
              {imagePreview ? (
                <Box
                  component="img"
                  src={imagePreview}
                  alt="Book Cover Preview"
                  sx={{
                    width: "100%",
                    maxWidth: 320,
                    height: 200,
                    objectFit: "contain",
                    borderRadius: 2,
                  }}
                />
              ) : (
                t("uploadBookCover", "Upload Book Cover")
              )}

              {imagePreview && (
                <Typography variant="caption" color="text.secondary">
                  {t("clickToChangeImage", "Click to change image")}
                </Typography>
              )}
            </Button>
          </label>

          {fieldErrors.image && (
            <Typography variant="body2" color="error" sx={{ mb: 2 }}>
              {fieldErrors.image}
            </Typography>
          )}

          {/* Title */}
          <TextField
            fullWidth
            label={t("titleLabel", "Title")}
            name="Title"
            value={form.Title}
            onChange={handleChange}
            onBlur={(e) => validateField("Title", e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.Title)}
            helperText={fieldErrors.Title}
          />

          <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
            {/* Category */}
            <TextField
              select
              fullWidth
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
              onBlur={(e) => validateField("categoryId", e.target.value)}
              SelectProps={{ native: true }}
              error={Boolean(fieldErrors.categoryId)}
              helperText={fieldErrors.categoryId}
            >
              <option value="" disabled>
                {t("selectCategory", "Select category")}
              </option>

              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </TextField>

            <Box sx={{ display: "flex", alignItems: "flex-start" }}>
              <SuggestCategoryButton />
            </Box>
          </Box>

          {/* Price */}
          {type === "toSale" && (
            <TextField
              fullWidth
              label={`${t("priceLabel", "Price")} (max ${MAX_SALE_PRICE})`}
              name="Price"
              type="number"
              value={form.Price}
              onChange={handleChange}
              onBlur={(e) => validateField("Price", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 1, max: MAX_SALE_PRICE }}
              error={Boolean(fieldErrors.Price)}
              helperText={fieldErrors.Price}
            />
          )}

          {/* Price Per Day */}
          {type === "toBorrow" && (
            <TextField
              fullWidth
              label={`${t(
                "pricePerDayLabel",
                "Price Per Day"
              )} (max ${MAX_BORROW_PRICE_PER_DAY})`}
              name="PricePerDay"
              type="number"
              value={form.PricePerDay}
              onChange={handleChange}
              onBlur={(e) => validateField("PricePerDay", e.target.value)}
              sx={{ mb: 2 }}
              inputProps={{ min: 1, max: MAX_BORROW_PRICE_PER_DAY }}
              error={Boolean(fieldErrors.PricePerDay)}
              helperText={fieldErrors.PricePerDay}
            />
          )}

          {/* Description */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("descriptionLabel", "Description")}
            name="Description"
            value={form.Description}
            onChange={handleChange}
            onBlur={(e) => validateField("Description", e.target.value)}
            sx={{ mb: 2 }}
            error={Boolean(fieldErrors.Description)}
            helperText={fieldErrors.Description}
          />

          {/* Type Selector */}
          <ToggleButtonGroup
            value={type}
            exclusive
            onChange={handleTypeChange}
            fullWidth
            sx={{ mt: 3 }}
          >
            <ToggleButton value="toSale">
              {t("sellType", "Sell")}
            </ToggleButton>
            <ToggleButton value="toDonate">
              {t("donateType", "Donate")}
            </ToggleButton>
            <ToggleButton value="toBorrow">
              {t("borrowType", "Borrow")}
            </ToggleButton>
          </ToggleButtonGroup>

          {/* Loading */}
          {loading && (
            <Alert
              severity="info"
              sx={{ mt: 3, display: "flex", alignItems: "center", gap: 2 }}
            >
              <CircularProgress size={20} />
              {t("aiReviewLoading", "Your book is being reviewed by our AI model...")}
            </Alert>
          )}

          {/* Error */}
          {error && !loading && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}

          {/* Success */}
          {successMessage && !loading && (
            <Alert severity="success" sx={{ mt: 3 }}>
              {t("bookAddedSuccessfully", "Book added successfully ✅")}
              <br />
              {t("passedAiReview", "It passed our AI review.")}
            </Alert>
          )}

          {/* Submit */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 3, py: 1.3 }}
            disabled={loading}
          >
            {t("addBook", "Add Book")}
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
