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
  friends: any[];
  sentFriendRequests: any[];
  receivedFriendRequests: any[];
  __v?: number;
  fullName: string;
  id: string;
}

export interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  limit: number;
  hasNext: boolean;
  hasPrev: boolean;
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

export interface UsersStats {
  totalUsers: number;
  confirmedUsers: number;
  unconfirmedUsers: number;
  adminUsers: number;
  regularUsers: number;
  recentRegistrations: number;
}

@Injectable({ providedIn: 'root' })
export class UsersService {
  private baseUrl = 'http://localhost:3000/user';

  constructor(private http: HttpClient) {}

  // Get all users with pagination and filters (Admin only)
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

  // Get user by ID (Admin only)
  getUserById(id: string): Observable<User> {
    return this.http.get<ApiResponse<User>>(`${this.baseUrl}/${id}`).pipe(
      map((response) => response.data),
      catchError((error) => {
        console.error('Failed to get user:', error);
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

  // Get users statistics (for admin dashboard) - UPDATED
  getUsersStats(): Observable<UsersStats> {
    return this.getAllUsers({ limit: 1000 }).pipe(
      map((response) => {
        const users = response.users;
        const total = response.pagination.totalCount;

        const confirmedUsers = users.filter((user) => user.isConfirmed).length;
        const adminUsers = users.filter((user) => user.role === 'admin').length;

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        const recentRegistrations = users.filter(
          (user) => new Date(user.createdAt) > weekAgo
        ).length;

        return {
          totalUsers: total,
          confirmedUsers: confirmedUsers,
          unconfirmedUsers: total - confirmedUsers,
          adminUsers: adminUsers,
          regularUsers: total - adminUsers,
          recentRegistrations: recentRegistrations,
        };
      })
    );
  }

  // Search users (Admin only)
  searchUsers(query: string, page = 1, limit = 10): Observable<UsersResponse> {
    return this.getAllUsers({ search: query, page, limit });
  }

  // Filter users by role (Admin only)
  filterUsersByRole(role: 'admin' | 'user', page = 1, limit = 10): Observable<UsersResponse> {
    return this.getAllUsers({ role, page, limit });
  }

  // Get unconfirmed users (Admin only)
  getUnconfirmedUsers(page = 1, limit = 10): Observable<UsersResponse> {
    return this.getAllUsers({ page, limit }).pipe(
      map((response) => ({
        ...response,
        users: response.users.filter((user) => !user.isConfirmed),
      }))
    );
  }

  // Promote user to admin (Admin only)
  promoteToAdmin(id: string): Observable<User> {
    return this.updateUser(id, { role: 'admin' });
  }

  // Demote admin to user (Admin only)
  demoteToUser(id: string): Observable<User> {
    return this.updateUser(id, { role: 'user' });
  }

  // Bulk confirm users (Admin only)
  bulkConfirmUsers(userIds: string[]): Observable<void> {
    const confirmRequests = userIds.map((id) => this.confirmUser(id).toPromise());
    return new Observable((observer) => {
      Promise.all(confirmRequests)
        .then(() => {
          observer.next();
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
