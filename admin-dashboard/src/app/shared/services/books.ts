import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  _id: string;
  Title: string;
  Description: string;
  TransactionType: 'toSale' | 'toBorrow' | 'toDonate';
  Price?: number;
  PricePerDay?: number;
  image: { secure_url: string; public_id: string };
  categoryId: { _id: string; name: string };
  UserID: { _id: string; firstName: string; secondName: string; email: string; fullName: string };
  IsModerated: boolean;
  isDeleted: boolean;
  isSold: boolean;
  isDonated: boolean;
  isBorrowedNow: boolean;
  status: 'available' | 'sold' | 'donated' | 'borrowed';
  createdAt: string;
  updatedAt: string;
  __v: number;
  currentBorrow?: any;
}

export interface BooksResponse {
  message: string;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  includeDeleted: boolean;
  books: Book[];
}

// Interface for category update response
export interface CategoryUpdateResponse {
  message: string;
  book: Book;
}

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  private baseUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  // Helper: Build headers with admin token
  private buildHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `admin ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ADMIN ENDPOINTS

  getAllBooksAdmin(token: string, params?: any): Observable<any> {
    const headers = this.buildHeaders(token);
    let httpParams = new HttpParams();

    if (params) {
      Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
          httpParams = httpParams.set(key, value.toString());
        }
      });
    }

    return this.http.get(`${this.baseUrl}/allbooks/admin`, {
      headers,
      params: httpParams,
    });
  }

  adminDeleteBook(bookId: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.delete(`${this.baseUrl}/admin/books/${bookId}`, { headers });
  }

  adminRestoreBook(bookId: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.patch(`${this.baseUrl}/admin/books/${bookId}/restore`, {}, { headers });
  }

  adminUpdateModeration(bookId: string, IsModerated: boolean, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.patch(
      `${this.baseUrl}/admin/books/${bookId}/moderate`,
      { IsModerated },
      { headers }
    );
  }

  adminUpdateBookCategory(
    bookId: string,
    categoryId: string,
    token: string
  ): Observable<CategoryUpdateResponse> {
    const headers = this.buildHeaders(token);
    const body = { categoryId };

    return this.http.patch<CategoryUpdateResponse>(
      `${this.baseUrl}/admin/books/${bookId}/category`,
      body,
      { headers }
    );
  }
}
