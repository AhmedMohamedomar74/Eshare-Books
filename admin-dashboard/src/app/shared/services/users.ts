import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface User {
  _id: string;
  firstName: string;
  secondName: string;
  email: string;
  role: 'admin' | 'user';
  isConfirmed: boolean;
  profilePic?: string;
  address?: string;
  createdAt: string;
  updatedAt: string;
  friendCount?: number;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface UsersResponse {
  users: User[];
  pagination: PaginationInfo;
}

export interface ApiResponse<T> {
  status: string;
  message: string;
  data: T;
}

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
  role?: 'admin' | 'user';
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  // Get all users with pagination and filters
  getAllUsers(params: GetUsersParams = {}): Observable<UsersResponse> {
    let httpParams = new HttpParams();

    if (params.page) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.role) httpParams = httpParams.set('role', params.role);

    return this.http.get<ApiResponse<UsersResponse>>(this.baseUrl, { params: httpParams }).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to get users:', error);
        throw error;
      })
    );
  }

  // Get user by ID
  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to get user:', error);
        throw error;
      })
    );
  }

  // Get user public profile
  getUserPublicProfile(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/public-profile/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to get user profile:', error);
        throw error;
      })
    );
  }

  // Update user (Admin only)
  updateUser(id: string, data: Partial<User>): Observable<User> {
    return this.http.put<ApiResponse<User>>(`${this.baseUrl}/${id}`, data).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to update user:', error);
        throw error;
      })
    );
  }

  // Confirm user (Admin only)
  confirmUser(id: string): Observable<User> {
    return this.http.patch<ApiResponse<User>>(`${this.baseUrl}/${id}/confirm`, {}).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to confirm user:', error);
        throw error;
      })
    );
  }

  // Delete user (Admin only)
  deleteUser(id: string): Observable<void> {
    return this.http.delete<ApiResponse<void>>(`${this.baseUrl}/${id}`).pipe(
      map(() => undefined),
      catchError((error) => {
        console.error('Failed to delete user:', error);
        throw error;
      })
    );
  }

  // Get users statistics (for dashboard)
  getUsersStats(): Observable<{
    totalUsers: number;
    confirmedUsers: number;
    unconfirmedUsers: number;
    adminUsers: number;
    regularUsers: number;
  }> {
    return this.getAllUsers({ limit: 1 }).pipe(
      map((response) => {
        const total = response.pagination.totalItems;
        return {
          totalUsers: total,
          confirmedUsers: 0,
          unconfirmedUsers: 0,
          adminUsers: 0,
          regularUsers: 0,
        };
      })
    );
  }

  // Search users
  searchUsers(query: string, page = 1, limit = 10): Observable<UsersResponse> {
    return this.getAllUsers({ search: query, page, limit });
  }

  // Filter users by role
  filterUsersByRole(role: 'admin' | 'user', page = 1, limit = 10): Observable<UsersResponse> {
    return this.getAllUsers({ role, page, limit });
  }
}
