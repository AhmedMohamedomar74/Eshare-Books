import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CategoriesService {
  private baseUrl = 'http://localhost:3000/categories';

  constructor(private http: HttpClient) {}

  getAllCategories(token: string): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  getCategoryById(id: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  createCategory(data: { name: string }, token: string): Observable<any> {
    return this.http.post(this.baseUrl, data, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  updateCategory(id: string, data: { name: string }, token: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, data, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  deleteCategory(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }
}
