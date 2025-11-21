// src/app/services/books.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class BooksService {
  // نفس الطريقة اللي بتستخدمها في AuthService
  private baseUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  // Helper: Build headers with Bearer token
  private buildHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `admin ${token}`,
      'Content-Type': 'application/json',
    });
  }

  // ===================================================================
  // ADMIN ENDPOINTS
  // ===================================================================

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

  // ===================================================================
  // USER ENDPOINTS
  // ===================================================================

  getAllBooks(token: string, params?: any): Observable<any> {
    const headers = this.buildHeaders(token);
    let httpParams = new HttpParams();
    if (params) {
      Object.keys(params).forEach((key) => {
        if (params[key]) httpParams = httpParams.set(key, params[key]);
      });
    }
    return this.http.get(`${this.baseUrl}/allbooks`, { headers, params: httpParams });
  }

  getBookById(bookId: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.get(`${this.baseUrl}/${bookId}`, { headers });
  }

  addBook(formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `admin ${token}`,
      // لا Content-Type → المتصفح بيحطه مع boundary
    });
    return this.http.post(`${this.baseUrl}/addbook`, formData, { headers });
  }

  updateBook(bookId: string, formData: FormData, token: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `admin ${token}`,
    });
    return this.http.patch(`${this.baseUrl}/${bookId}`, formData, { headers });
  }

  deleteBook(bookId: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.delete(`${this.baseUrl}/${bookId}`, { headers });
  }

  getBooksByCategory(categoryId: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.get(`${this.baseUrl}/category/${categoryId}`, { headers });
  }

  getBooksByTransactionType(type: string, token: string): Observable<any> {
    const headers = this.buildHeaders(token);
    return this.http.get(`${this.baseUrl}/type/${type}`, { headers });
  }

  getBooksByUserId(userId: string): Observable<any> {
    // عام، مش محتاج token
    return this.http.get(`${this.baseUrl}/user/${userId}`);
  }
}
