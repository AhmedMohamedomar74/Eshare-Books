import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../../shared/services/auth';

@Injectable({ providedIn: 'root' })
export class SuggestCategoryService {
  private baseUrl = 'http://localhost:3000/suggest-categories';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getHeadersOptions() {
    const token = this.auth.getAccessToken();
    if (!token) return {};
    const headers = new HttpHeaders({ Authorization: `admin ${token}` });
    return { headers };
  }

  // Get all suggested categories (Admin only)
  getAllSuggestedCategories(): Observable<any> {
    return this.http.get(this.baseUrl, this.getHeadersOptions());
  }

  // Get suggested category by ID (Admin only)
  getSuggestedCategoryById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, this.getHeadersOptions());
  }

  // Delete suggested category (soft delete - Admin only)
  deleteSuggestCategory(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, this.getHeadersOptions());
  }
}
