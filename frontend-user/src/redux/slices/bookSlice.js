import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import bookService from "../../services/book.service.js";

// ✅ Add new book
export const createBook = createAsyncThunk(
  "books/createBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const response = await bookService.addBook(bookData);
      return response.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add book."
      );
    }
  }
);

// ✅ Get all books
export const fetchBooks = createAsyncThunk(
  "books/fetchBooks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await bookService.getAllBooks();
      return response;
    } catch (error) {
      return rejectWithValue("Failed to fetch books");
    }
  }
);

const bookSlice = createSlice({
  name: "books",
  initialState: {
    books: [],
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Book
      .addCase(createBook.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.loading = false;
        state.books.push(action.payload);
        state.successMessage = "✅ Book added successfully!";
      })
      .addCase(createBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch Books
      .addCase(fetchBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = bookSlice.actions;
export default bookSlice.reducer;
