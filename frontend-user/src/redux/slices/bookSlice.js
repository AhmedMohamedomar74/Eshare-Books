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

// ✅ Get single book by ID
export const fetchBookById = createAsyncThunk(
  "books/fetchBookById",
  async (bookId, { rejectWithValue }) => {
    try {
      const response = await bookService.getBookById(bookId);
      return response.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch book"
      );
    }
  }
);

// ✅ Update book
export const updateBook = createAsyncThunk(
  "books/updateBook",
  async ({ bookId, formData }, { rejectWithValue }) => {
    try {
      const response = await bookService.updateBook(bookId, formData);
      return response.book;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update book"
      );
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
      })

      // Fetch book by Id
      .addCase(fetchBookById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBook = action.payload;
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // update book
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "✅ Book updated successfully!";

        // Update the book in the books array
        const index = state.books.findIndex(
          (book) => book._id === action.payload._id
        );
        if (index !== -1) {
          state.books[index] = action.payload;
        }

        // Update currentBook if it's the same
        if (state.currentBook?._id === action.payload._id) {
          state.currentBook = action.payload;
        }
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = bookSlice.actions;
export default bookSlice.reducer;
