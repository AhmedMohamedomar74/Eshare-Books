import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { updateBook, clearMessages } from "../../redux/slices/bookSlice.js";
import bookService from "../../services/book.service.js";
import { useParams, useNavigate } from "react-router-dom";
import EditBookAlerts from "../../components/Edit Book/EditBookAlerts.jsx";
import EditBookForm from "../../components/Edit Book/EditBookForm.jsx";
import EditBookButtons from "../../components/Edit Book/EditBookButtons.jsx";

export default function EditBook() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, successMessage } = useSelector(
    (state) => state.books
  );

  const [type, setType] = useState("toSale");
  const [image, setImage] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loadingBook, setLoadingBook] = useState(true);

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

  // Load book + categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingBook(true);

        const categoriesData = await bookService.getAllCategories();
        setCategories(categoriesData || []);

        const bookData = await bookService.getBookById(id);
        const book = bookData?.book || bookData;

        const catId =
          book.categoryId?._id ||
          book.categoryId ||
          book.category?._id ||
          book.category ||
          "";

        setForm({
          Title: book.Title || "",
          categoryId: catId,
          Price: book.Price?.toString() || "",
          PricePerDay: book.PricePerDay?.toString() || "",
          Description: book.Description || "",
        });

        setType(book.TransactionType || "toSale");
        setExistingImage(book.image?.secure_url || book.image || null);
      } catch (err) {
        alert("Failed to load the book data.");
        navigate("/profile");
      } finally {
        setLoadingBook(false);
      }
    };

    fetchData();

    return () => dispatch(clearMessages());
  }, [id, dispatch, navigate]);

  useEffect(() => {
    if (successMessage) {
      setTimeout(() => navigate("/profile"), 2000);
    }
  }, [successMessage, navigate]);

  const handleTypeChange = (_, newType) => {
    if (!newType) return;

    setType(newType);
    setForm((prev) => ({
      ...prev,
      Price: "",
      PricePerDay: "",
    }));
    setFieldErrors((prev) => ({
      ...prev,
      Price: "",
      PricePerDay: "",
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
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
        image: `Image must be less than ${maxSizeMB}MB`,
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
    let err = "";

    if (name === "Title" && (!value.trim() || value.trim().length < 2))
      err = "Title must be at least 2 characters";

    if (name === "categoryId" && !value) err = "Category is required";

    if (name === "Description" && (!value.trim() || value.trim().length < 10))
      err = "Description must be at least 10 characters";

    if (name === "Price" && type === "toSale" && Number(value) <= 0)
      err = "Price must be greater than zero";

    if (name === "PricePerDay" && type === "toBorrow" && Number(value) <= 0)
      err = "Price per day must be greater than zero";

    setFieldErrors((prev) => ({ ...prev, [name]: err }));
    return err === "";
  };

  const validateForm = () => {
    const errors = {};

    if (!form.Title.trim() || form.Title.trim().length < 2)
      errors.Title = "Title is required";

    if (!form.categoryId) errors.categoryId = "Category is required";

    if (!form.Description.trim() || form.Description.trim().length < 10)
      errors.Description = "Description must be at least 10 characters";

    if (type === "toSale") {
      if (!form.Price || Number(form.Price) <= 0)
        errors.Price = "Price is required";
    }

    if (type === "toBorrow") {
      if (!form.PricePerDay || Number(form.PricePerDay) <= 0)
        errors.PricePerDay = "Price per day is required";
    }

    setFieldErrors((prev) => ({ ...prev, ...errors }));
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const formData = new FormData();
    formData.append("Title", form.Title.trim());
    formData.append("categoryId", form.categoryId);
    formData.append("Description", form.Description.trim());
    formData.append("TransactionType", type);

    if (type === "toSale") formData.append("Price", form.Price);
    if (type === "toBorrow") formData.append("PricePerDay", form.PricePerDay);
    if (image) formData.append("image", image);

    dispatch(updateBook({ bookId: id, formData }));
  };

  if (loadingBook) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

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
            Edit Your Book
          </Typography>

          {/* Form Section */}
          <EditBookForm
            form={form}
            categories={categories}
            type={type}
            fieldErrors={fieldErrors}
            handleChange={handleChange}
            validateField={validateField}
            handleTypeChange={handleTypeChange}
            existingImage={existingImage}
            image={image}
            handleImageUpload={handleImageUpload}
          />

          {/* Alerts */}
          <EditBookAlerts
            loading={loading}
            error={error}
            successMessage={successMessage}
          />

          {/* Buttons */}
          <EditBookButtons
            loading={loading}
            onCancel={() => navigate("/profile")}
          />
        </Paper>
      </Container>
    </Box>
  );
}
