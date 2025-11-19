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

  // ✅ النوع دلوقتي نفس قيم الـ backend: "toSale" | "toDonate" | "toBorrow"
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

  // ✅ أخطاء الفاليديشن في الفرونت
  const [fieldErrors, setFieldErrors] = useState({
    image: "",
    Price: "",
    PricePerDay: "",
  });

  // ✅ جلب التصنيفات عند تحميل المكون
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

    // تنظيف الرسائل عند الخروج من الصفحة (اختياري)
    return () => {
      dispatch(clearMessages());
    };
  }, [dispatch]);

  // ✅ تنظيف حقول السعر عند تغيير النوع
  const handleTypeChange = (_, newType) => {
    if (newType) {
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
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      setFieldErrors((prev) => ({ ...prev, image: "" }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // لو المستخدم بيكتب سعر / سعر اليوم، نمنع السالب في الستيت
    if ((name === "Price" || name === "PricePerDay") && Number(value) < 0) {
      // منخليش value سالب في الستيت
      setForm((prev) => ({ ...prev, [name]: "" }));
      setFieldErrors((prev) => ({
        ...prev,
        [name]: "Price cannot be negative",
      }));
      return;
    }

    setForm({ ...form, [name]: value });

    // نمسح رسالة الخطأ للحقل اللي بيتغير
    setFieldErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  // ✅ فاليديشن في الفرونت قبل ما نبعت الـ request
  const validateForm = () => {
    const errors = {};

    // لازم يرفع صورة
    if (!image) {
      errors.image = "Book cover image is required";
    }

    if (type === "toSale") {
      if (form.Price === "" || form.Price === null) {
        errors.Price = "Price is required for sale";
      } else if (Number(form.Price) < 0) {
        errors.Price = "Price cannot be negative";
      }
    }

    if (type === "toBorrow") {
      if (form.PricePerDay === "" || form.PricePerDay === null) {
        errors.PricePerDay = "Price per day is required for borrowing";
      } else if (Number(form.PricePerDay) < 0) {
        errors.PricePerDay = "Price per day cannot be negative";
      }
    }

    setFieldErrors(errors);

    // لو في أخطاء نرجع false
    return Object.keys(errors).length === 0;
  };

  // ✅ إرسال الفورم بناءً على النوع (متوافق مع الـ Joi والـ Schema)
  const handleSubmit = (e) => {
    e.preventDefault();

    // أولاً: فاليديشن فرونت
    const isValid = validateForm();
    if (!isValid) return; // متبعتش حاجة لو في أخطاء

    const formData = new FormData();

    formData.append("Title", form.Title);
    formData.append("categoryId", form.categoryId);
    formData.append("Description", form.Description);

    // 👇 النوع زي ما هو: "toSale" / "toBorrow" / "toDonate"
    formData.append("TransactionType", type);

    // السعر المطلوب في حالة البيع
    if (type === "toSale") {
      formData.append("Price", form.Price);
    }

    // سعر اليوم مطلوب في حالة الاستعارة
    if (type === "toBorrow") {
      formData.append("PricePerDay", form.PricePerDay);
    }

    if (image) {
      formData.append("image", image);
    }

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
            sx={{ mb: 2 }}
            required
          />

          {/* 📂 Category Dropdown */}
          <TextField
            select
            fullWidth
            // label="Category"
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
            SelectProps={{ native: true }}
            sx={{ mb: 2 }}
            required
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
              sx={{ mb: 2 }}
              required
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
              sx={{ mb: 2 }}
              required
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

          {/* 🌀 Loading Spinner */}
          {loading && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

          {/* ⚠️ Error & ✅ Success Messages */}
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
