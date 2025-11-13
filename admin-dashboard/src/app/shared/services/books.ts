import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BooksService {
  private baseUrl = 'http://localhost:3000/books';

  constructor(private http: HttpClient) {}

  getAllBooks(token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/allbooks`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  getBookById(id: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  addBook(formData: FormData, token: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/addbook`, formData, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  updateBook(id: string, formData: FormData, token: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}`, formData, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  deleteBook(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }
}
