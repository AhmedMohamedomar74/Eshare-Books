import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private baseUrl = 'http://localhost:3000/categories';

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
  // Get all categories for admin (including deleted)
  getAllCategoriesForAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin`, this.getHeadersOptions());
  }

  // Restore deleted category
  restoreCategory(id: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/admin/categories/${id}/restore`,
      {},
      this.getHeadersOptions()
    );
  }
}
