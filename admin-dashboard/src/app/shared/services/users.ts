import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  getAllUsers(token: string): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  getUserById(id: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  deleteUser(id: string, token: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }
}
