import api from "../axiosInstance/axiosInstance.js";

// ✅ Add new book
const addBook = async (formData) => {
  const res = await api.post("/books/addbook", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Get all books
const getAllBooks = async () => {
  const res = await api.get("/books/allbooks");
  return res.data.books;
};

// ✅ Get single book by ID
const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data.book;
};
// ✅ Get books by search title
const searchBooks = async (title) => {
  const res = await api.get(`/books/allbooks?title=${encodeURIComponent(title)}`);
  return res.data.books;
};

// ✅ Get books by category
const getBooksByCategory = async (categoryId) => {
  const res = await api.get(`/books/category/${categoryId}`);
  return res.data.books;
};

// ✅ Get all categories
const getAllCategories = async () => {
  const res = await api.get(`/categories`);
  return res.data.data;
};

const bookService = {
  addBook,
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByCategory,
  getAllCategories,
};

export default bookService;


