import api from "../axiosInstance/axiosInstance.js";

// ✅ Add new book
const addBook = async (formData) => {
  const res = await api.post("/books/addbook", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// ✅ Get all books (with pagination + optional title)
const getAllBooks = async (page = 1, limit = 10, title = "") => {
  const params = new URLSearchParams();
  params.append("page", page);
  params.append("limit", limit);
  if (title) params.append("title", title);

  const res = await api.get(`/books/allbooks?${params.toString()}`);
  // بيرجع { message, total, page, limit, books }
  return res.data;
};

// ✅ Get single book by ID
const getBookById = async (id) => {
  const res = await api.get(`/books/${id}`);
  return res.data.book;
};

// ✅ Get books by search title (لو محتاجة في مكان تاني)
const searchBooks = async (title, page = 1, limit = 9) => {
  return getAllBooks(page, limit, title);
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

// ✅ Get books by transaction type
const getBooksByType = async (type) => {
  const res = await api.get(`/books/type/${type}`);
  return res.data.books;
};

const bookService = {
  addBook,
  getAllBooks,
  getBookById,
  searchBooks,
  getBooksByCategory,
  getAllCategories,
  getBooksByType,
};

export default bookService;
