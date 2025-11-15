import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private baseUrl = 'http://localhost:3000/reports';

  constructor(private http: HttpClient) {}

  getAllReports(token: string): Observable<any> {
    return this.http
      .get(this.baseUrl, {
        headers: new HttpHeaders({
          Authorization: `admin ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching reports:', error);
          return throwError(() => error);
        })
      );
  }

  getReportsByUser(userId: string, token: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/user/${userId}`, {
        headers: new HttpHeaders({
          Authorization: `admin ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching user reports:', error);
          return throwError(() => error);
        })
      );
  }

  getReportsAgainstUser(userId: string, token: string): Observable<any> {
    return this.http
      .get(`${this.baseUrl}/target/${userId}`, {
        headers: new HttpHeaders({
          Authorization: `admin ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error fetching reports against user:', error);
          return throwError(() => error);
        })
      );
  }

  updateReportStatus(reportId: string, status: string, token: string): Observable<any> {
    return this.http
      .patch(
        `${this.baseUrl}/${reportId}`,
        { status },
        {
          headers: new HttpHeaders({
            Authorization: `admin ${token}`,
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error updating report status:', error);
          return throwError(() => error);
        })
      );
  }

  deleteReport(reportId: string, token: string): Observable<any> {
    return this.http
      .delete(`${this.baseUrl}/${reportId}`, {
        headers: new HttpHeaders({
          Authorization: `admin ${token}`,
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        catchError((error) => {
          console.error('Error deleting report:', error);
          return throwError(() => error);
        })
      );
  }

  restoreReport(reportId: string, token: string): Observable<any> {
    return this.http
      .patch(
        `${this.baseUrl}/restore/${reportId}`,
        {},
        {
          headers: new HttpHeaders({
            Authorization: `admin ${token}`,
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        catchError((error) => {
          console.error('Error restoring report:', error);
          return throwError(() => error);
        })
      );
  }
}
