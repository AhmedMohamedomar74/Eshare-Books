import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// Interfaces
export interface Book {
  _id: string;
  Title: string;
  Description: string;
  categoryId: {
    _id: string;
    name: string;
  };
  IsModerated: boolean;
  UserID: {
    _id: string;
    firstName: string;
    secondName: string;
    email: string;
    avatar?: string;
    name?: string;
  };
  TransactionType: 'toSale' | 'toBorrow' | 'toExchange' | 'toDonate';
  image?: {
    secure_url: string;
    public_id: string;
  };
  Price?: number;
  PricePerDay?: number;
  isDeleted: boolean;
  isSold?: boolean;
  isDonated?: boolean;
  isBorrowedNow?: boolean;
  status?: 'available' | 'sold' | 'donated' | 'borrowed' | 'deleted';
  createdAt: string;
  updatedAt: string;
}

export interface BooksResponse {
  message: string;
  total: number;
  page: number;
  limit: number;
  totalPages?: number;
  includeDeleted?: boolean;
  books: Book[];
}

export interface Category {
  _id: string;
  name: string;
}

export interface CategoriesResponse {
  categories?: Category[];
  data?: {
    categories: Category[];
  };
}

@Injectable({ providedIn: 'root' })
export class BooksService {
  private baseUrl = 'http://localhost:3000/books';
  private categoriesUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  /**
   * Create Authorization header using "admin" scheme
   */
  private createHeaders(token?: string): HttpHeaders | undefined {
    if (!token) return undefined;
    return new HttpHeaders({
      Authorization: `admin ${token}`,
    });
  }

  /**
   * Build HTTP options with headers and query params
   */
  private buildOptions(
    token?: string,
    paramsObj?: Record<string, string | number | boolean | undefined>
  ): { headers?: HttpHeaders; params?: HttpParams } {
    const options: { headers?: HttpHeaders; params?: HttpParams } = {};

    // Add headers if token exists
    const headers = this.createHeaders(token);
    if (headers) options.headers = headers;

    // Build query params
    if (paramsObj) {
      let params = new HttpParams();
      Object.keys(paramsObj).forEach((key) => {
        const value = paramsObj[key];
        if (value !== undefined && value !== null && value !== '') {
          params = params.set(key, String(value));
        }
      });
      options.params = params;
    }

    return options;
  }

  // ════════════════════════════════════════════════════════════════
  // 📚 BOOKS ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Get all books including deleted, sold, donated (Admin Only)
   * Supports advanced filtering and pagination
   */
  getAllBooksIncludingAll(
    token?: string,
    page?: number,
    limit?: number,
    title?: string,
    category?: string,
    status?: string,
    transactionType?: string,
    includeDeleted?: boolean
  ): Observable<BooksResponse> {
    let httpParams = new HttpParams();

    if (page !== undefined) httpParams = httpParams.set('page', String(page));
    if (limit !== undefined) httpParams = httpParams.set('limit', String(limit));
    if (title) httpParams = httpParams.set('title', title);
    if (category) httpParams = httpParams.set('category', category);
    if (status) httpParams = httpParams.set('status', status);
    if (transactionType) httpParams = httpParams.set('transactionType', transactionType);
    if (includeDeleted !== undefined) {
      httpParams = httpParams.set('includeDeleted', String(includeDeleted));
    }

    const options = {
      headers: this.createHeaders(token),
      params: httpParams,
    };

    return this.http.get<BooksResponse>(`${this.baseUrl}/allbooks/admin`, options);
  }

  /**
   * Get all books (regular users) - excludes sold/donated
   */
  getAllBooks(
    token?: string,
    page?: number,
    limit?: number,
    title?: string
  ): Observable<BooksResponse> {
    const options = this.buildOptions(token, {
      page,
      limit,
      title,
    });
    return this.http.get<BooksResponse>(`${this.baseUrl}/allbooks`, options);
  }

  /**
   * Get book by ID
   */
  getBookById(id: string, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.get(`${this.baseUrl}/${id}`, options);
  }

  /**
   * Get books by category
   */
  getBooksByCategory(categoryId: string, token?: string): Observable<BooksResponse> {
    const options = this.buildOptions(token);
    return this.http.get<BooksResponse>(`${this.baseUrl}/category/${categoryId}`, options);
  }

  /**
   * Get books by transaction type
   */
  getBooksByTransactionType(type: string, token?: string): Observable<BooksResponse> {
    const options = this.buildOptions(token);
    return this.http.get<BooksResponse>(`${this.baseUrl}/type/${type}`, options);
  }

  /**
   * Get books by user ID
   */
  getBooksByUserId(userId: string, token?: string): Observable<BooksResponse> {
    const options = this.buildOptions(token);
    return this.http.get<BooksResponse>(`${this.baseUrl}/user/${userId}`, options);
  }

  /**
   * Add new book with FormData (image upload)
   * Note: Do NOT manually set Content-Type header for FormData
   */
  addBook(formData: FormData, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.post(`${this.baseUrl}/addbook`, formData, options);
  }

  /**
   * Update book - supports both FormData and JSON body
   */
  updateBook(id: string, body: any, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.patch(`${this.baseUrl}/${id}`, body, options);
  }

  /**
   * Delete book (soft delete)
   */
  deleteBook(id: string, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.delete(`${this.baseUrl}/${id}`, options);
  }

  /**
   * Restore deleted book
   * Uses generic PATCH endpoint to set isDeleted = false
   */
  restoreBook(id: string, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    const body = { isDeleted: false };
    return this.http.patch(`${this.baseUrl}/${id}`, body, options);
  }

  // ════════════════════════════════════════════════════════════════
  // 🏷️ CATEGORIES ENDPOINTS
  // ════════════════════════════════════════════════════════════════

  /**
   * Get all categories
   */
  getCategories(token?: string): Observable<CategoriesResponse> {
    const options = this.buildOptions(token);
    return this.http.get<CategoriesResponse>(this.categoriesUrl, options);
  }

  /**
   * Get category by ID
   */
  getCategoryById(id: string, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.get(`${this.categoriesUrl}/${id}`, options);
  }

  /**
   * Create new category
   */
  createCategory(data: { name: string }, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.post(this.categoriesUrl, data, options);
  }

  /**
   * Update category
   */
  updateCategory(id: string, data: { name: string }, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.put(`${this.categoriesUrl}/${id}`, data, options);
  }

  /**
   * Delete category
   */
  deleteCategory(id: string, token?: string): Observable<any> {
    const options = this.buildOptions(token);
    return this.http.delete(`${this.categoriesUrl}/${id}`, options);
  }
}
