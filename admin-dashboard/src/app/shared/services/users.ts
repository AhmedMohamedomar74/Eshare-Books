// src/app/services/users.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<any> {
    return this.http.get<{ data: { users: any[] } }>(this.baseUrl);
  }

  confirmUser(id: string): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${id}/confirm`, {});
  }

  deleteUser(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
