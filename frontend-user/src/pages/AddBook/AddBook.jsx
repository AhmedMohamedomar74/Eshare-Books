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
  MenuItem, // (MenuItem لم يُستخدم في الكود الأصلي لكنه موجود في import)
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

  const [type, setType] = useState("Sell"); // "Sell", "Donate", "Borrow"
  const [image, setImage] = useState(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    Title: "",
    categoryId: "",
    Price: "",
    PricePerDay: "", // ✅ الحقل الجديد لسعر الاستعارة
    Description: "",
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
  }, []);

  // ✅ (مُحسّن) تنظيف حقول السعر عند تغيير النوع
  const handleTypeChange = (_, newType) => {
    if (newType) {
      setType(newType);
      // تنظيف الحقول عند التغيير
      setForm((prevForm) => ({
        ...prevForm,
        Price: "",
        PricePerDay: "",
      }));
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) setImage(file);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ (مُعدّل) إرسال الفورم بناءً على النوع
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();

    // إضافة الحقول الأساسية
    formData.append("Title", form.Title);
    formData.append("categoryId", form.categoryId);
    formData.append("Description", form.Description);
    formData.append("TransactionType", `to${type}`); // "toSell", "toBorrow", "toDonate"

    // إضافة السعر فقط في حالة البيع
    if (type === "Sell") {
      formData.append("Price", form.Price);
    }

    // ✅ إضافة سعر اليوم فقط في حالة الاستعارة
    if (type === "Borrow") {
      formData.append("PricePerDay", form.PricePerDay);
    }

    // إضافة الصورة إذا وُجدت
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
              variant="outlined"
              startIcon={<CloudUploadIcon />}
              fullWidth
              sx={{
                mb: 3,
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
//             label="Category" // (تم إضافة Label ليتوافق مع التصميم)
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

          {/* 💰 Price (only if Sell) */}
          {type === "Sell" && (
            <TextField
              fullWidth
              label="Price"
              name="Price"
              type="number"
              value={form.Price}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
            />
          )}

          {/* 📅 Price Per Day (only if Borrow) */}
          {type === "Borrow" && (
            <TextField
              fullWidth
              label="Price Per Day"
              name="PricePerDay"
              type="number"
              value={form.PricePerDay}
              onChange={handleChange}
              sx={{ mb: 2 }}
              required
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
            <ToggleButton value="Sell">Sell</ToggleButton>
            <ToggleButton value="Donate">Donate</ToggleButton>
            <ToggleButton value="Borrow">Borrow</ToggleButton>
          </ToggleButtonGroup>

          {/* 🌀 Loading Spinner */}
          {loading && (
            <Box display="flex" justifyContent="center" sx={{ mt: 3 }}>
              <CircularProgress />
            </Box>
          )}

    _      {/* ⚠️ Error & ✅ Success Messages */}
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