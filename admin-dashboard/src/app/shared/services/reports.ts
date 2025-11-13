import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ReportsService {
  private baseUrl = 'http://localhost:5000/reports';

  constructor(private http: HttpClient) {}

  getAllReports(token: string): Observable<any> {
    return this.http.get(this.baseUrl, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  getReportsByUser(userId: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${userId}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  getReportsAgainstUser(userId: string, token: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/target/${userId}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  updateReportStatus(reportId: string, status: string, token: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/${reportId}`,
      { status },
      {
        headers: new HttpHeaders({ Authorization: `admin ${token}` }),
      }
    );
  }

  deleteReport(reportId: string, token: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${reportId}`, {
      headers: new HttpHeaders({ Authorization: `admin ${token}` }),
    });
  }

  restoreReport(reportId: string, token: string): Observable<any> {
    return this.http.patch(
      `${this.baseUrl}/restore/${reportId}`,
      {},
      {
        headers: new HttpHeaders({ Authorization: `admin ${token}` }),
      }
    );
  }
}
