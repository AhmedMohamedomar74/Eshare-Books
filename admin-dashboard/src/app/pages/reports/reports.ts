import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Report {
  reporterId: string;
  targetType: string;
  targetId: string;
  reason: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class Reports {
  reports: Report[] = [
    {
      reporterId: 'USR-112',
      targetType: 'Book',
      targetId: 'BK-451',
      reason: 'Inappropriate content...',
      status: 'pending',
      createdAt: '2023-10-26',
    },
    {
      reporterId: 'USR-115',
      targetType: 'User',
      targetId: 'USR-118',
      reason: 'Spamming comments...',
      status: 'resolved',
      createdAt: '2023-10-25',
    },
    {
      reporterId: 'USR-118',
      targetType: 'Comment',
      targetId: 'CMT-821',
      reason: 'Harassment...',
      status: 'pending',
      createdAt: '2023-10-25',
    },
    {
      reporterId: 'USR-121',
      targetType: 'Book',
      targetId: 'BK-502',
      reason: 'Copyright infringement...',
      status: 'dismissed',
      createdAt: '2023-10-24',
    },
    {
      reporterId: 'USR-130',
      targetType: 'User',
      targetId: 'USR-115',
      reason: 'Fake profile...',
      status: 'resolved',
      createdAt: '2023-10-23',
    },
  ];

  searchQuery: string = '';
  statusFilter: string = 'All';
  targetTypeFilter: string = 'All';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalResults: number = 57;

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
  }

  onTargetTypeFilter(type: string): void {
    this.targetTypeFilter = type;
    this.currentPage = 1;
  }

  editReport(report: Report): void {
    console.log('Edit report:', report);
  }

  deleteReport(report: Report): void {
    console.log('Delete report:', report);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalResults / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
}
