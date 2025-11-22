import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private baseUrl = 'http://localhost:3000/categories';
  private booksBaseUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeadersOptions() {
    const token = this.auth.getAccessToken();
    if (!token) return {};
    const headers = new HttpHeaders({ Authorization: `admin ${token}` });
    return { headers };
  }

  getAllCategories(): Observable<any> {
    return this.http.get(this.baseUrl, this.getHeadersOptions());
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeadersOptions());
  }

  createCategory(data: { name: string }): Observable<any> {
    return this.http.post(this.baseUrl, data, this.getHeadersOptions());
  }

  updateCategory(id: string, data: { name: string }): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, this.getHeadersOptions());
  }

  deleteCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeadersOptions());
  }

  getBooksByCategory(categoryId: string): Observable<any> {
    return this.http.get(`${this.booksBaseUrl}/category/${categoryId}`, this.getHeadersOptions());
  }
}
