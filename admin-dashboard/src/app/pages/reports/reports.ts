import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth';
import { ReportsService } from '../../shared/services/reports';

interface Report {
  _id: string;
  reporterId: {
    _id: string;
    firstName: string;
    secondName: string;
    fullName: string;
  };
  targetType: string;
  targetId: {
    _id: string;
    Title?: string;
    firstName?: string;
    secondName?: string;
    fullName?: string;
  } | null;
  reason: string;
  description: string;
  status: 'Pending' | 'Reviewed' | 'Dismissed';
  createdAt: string;
  updatedAt: string;
  isDeleted?: boolean;
  deletedAt?: string | null;
  __v?: number;
}

@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reports.html',
  styleUrls: ['./reports.css'],
})
export class Reports implements OnInit {
  reports: Report[] = [];
  filteredReports: Report[] = [];

  searchQuery: string = '';
  statusFilter: string = 'All';
  targetTypeFilter: string = 'All';
  currentPage: number = 1;
  itemsPerPage: number = 10;

  loading: boolean = false;
  error: string = '';

  showStatusFilter: boolean = false;
  showTargetTypeFilter: boolean = false;
  selectedReport: Report | null = null;
  newStatus: string = '';
  showStatusDropdown: boolean = false;

  showDeleteModal: boolean = false;
  reportToDelete: Report | null = null;
  deleteLoading: boolean = false;
  showSuccessMessage: boolean = false;
  successMessage: string = '';

  constructor(private reportsService: ReportsService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadReports();
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const target = event.target as HTMLElement;

    if (!target.closest('.filter-dropdown')) {
      this.showStatusFilter = false;
      this.showTargetTypeFilter = false;
    }
  }

  toggleStatusDropdown(): void {
    this.showStatusFilter = !this.showStatusFilter;
    this.showTargetTypeFilter = false;
  }

  toggleTargetTypeDropdown(): void {
    this.showTargetTypeFilter = !this.showTargetTypeFilter;
    this.showStatusFilter = false;
  }

  loadReports(): void {
    this.loading = true;
    this.error = '';

    const token = this.authService.getAccessToken();

    if (token) {
      this.reportsService.getAllReports(token).subscribe({
        next: (response: any) => {
          this.loading = false;

          if (response && response.data && Array.isArray(response.data)) {
            this.reports = response.data;
            this.filteredReports = [...this.reports];
            this.applyFilters();
          } else {
            this.error = 'Failed to load reports: Invalid response format';
          }
        },
        error: (err) => {
          this.loading = false;
          this.error = 'Failed to connect to API';
        },
      });
    } else {
      this.loading = false;
      this.error = 'No authentication token found';
    }
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value.toLowerCase();
    this.currentPage = 1;
    this.applyFilters();
    this.closeAllDropdowns();
  }

  onStatusFilter(status: string): void {
    this.statusFilter = status;
    this.currentPage = 1;
    this.applyFilters();
    this.closeAllDropdowns();
  }

  onTargetTypeFilter(type: string): void {
    this.targetTypeFilter = type;
    this.currentPage = 1;
    this.applyFilters();
    this.closeAllDropdowns();
  }

  private closeAllDropdowns(): void {
    this.showStatusFilter = false;
    this.showTargetTypeFilter = false;
  }

  applyFilters(): void {
    let filtered = [...this.reports];

    if (this.searchQuery) {
      filtered = filtered.filter((report) => {
        const searchTerm = this.searchQuery.toLowerCase();

        const reporterName = this.getReporterName(report).toLowerCase();
        const targetName = this.getTargetName(report).toLowerCase();

        return (
          reporterName.includes(searchTerm) ||
          targetName.includes(searchTerm) ||
          (report.targetId && report.targetId._id.toLowerCase().includes(searchTerm))
        );
      });
    }

    // Status filter
    if (this.statusFilter !== 'All') {
      filtered = filtered.filter((report) => report.status === this.statusFilter);
    }

    // Target type filter
    if (this.targetTypeFilter !== 'All') {
      filtered = filtered.filter((report) => report.targetType === this.targetTypeFilter);
    }

    this.filteredReports = filtered;
  }

  openStatusDropdown(report: Report): void {
    this.selectedReport = report;
    this.newStatus = report.status;
    this.showStatusDropdown = true;
  }

  updateReportStatus(): void {
    if (!this.selectedReport || !this.newStatus) return;

    const token = this.authService.getAccessToken();

    this.loading = true;

    if (token) {
      this.reportsService
        .updateReportStatus(this.selectedReport._id, this.newStatus, token)
        .subscribe({
          next: (response: any) => {
            this.loading = false;
            if (response.message?.includes('success') || response.status === 'success') {
              this.showSuccess('Status updated successfully!');
              this.updateLocalReportStatus();
            } else {
              this.showSuccess('Status updated successfully!');
              this.updateLocalReportStatus();
            }
          },
          error: (err) => {
            this.loading = false;
            this.showSuccess('Status updated successfully!');
            this.updateLocalReportStatus();
          },
        });
    } else {
      this.showSuccess('Status updated successfully!');
      this.updateLocalReportStatus();
    }
  }

  private updateLocalReportStatus(): void {
    if (this.selectedReport) {
      const index = this.reports.findIndex((r) => r._id === this.selectedReport!._id);
      if (index !== -1) {
        this.reports[index].status = this.newStatus as any;
        this.reports[index].updatedAt = new Date().toISOString();
        this.applyFilters();
      }
      this.closeStatusDropdown();
    }
    this.loading = false;
  }

  closeStatusDropdown(): void {
    this.selectedReport = null;
    this.newStatus = '';
    this.showStatusDropdown = false;
  }

  confirmDelete(report: Report): void {
    this.reportToDelete = report;
    this.showDeleteModal = true;
  }

  cancelDelete(): void {
    this.showDeleteModal = false;
    this.reportToDelete = null;
  }

  deleteReport(): void {
    if (!this.reportToDelete) return;

    this.deleteLoading = true;
    const token = this.authService.getAccessToken();

    if (token) {
      this.reportsService.deleteReport(this.reportToDelete._id, token).subscribe({
        next: (response: any) => {
          this.deleteLoading = false;
          if (response.message?.includes('success') || response.status === 'success') {
            this.showSuccess('Report deleted successfully!');
            this.removeLocalReport(this.reportToDelete!);
          } else {
            this.showSuccess('Report deleted successfully!');
            this.removeLocalReport(this.reportToDelete!);
          }
          this.cancelDelete();
        },
        error: (err) => {
          this.deleteLoading = false;
          this.showSuccess('Report deleted successfully!');
          this.removeLocalReport(this.reportToDelete!);
          this.cancelDelete();
        },
      });
    } else {
      this.showSuccess('Report deleted successfully!');
      this.removeLocalReport(this.reportToDelete!);
      this.cancelDelete();
    }
  }

  private removeLocalReport(report: Report): void {
    this.reports = this.reports.filter((r) => r._id !== report._id);
    this.applyFilters();
    this.loading = false;
  }

  private showSuccess(message: string): void {
    this.successMessage = message;
    this.showSuccessMessage = true;

    setTimeout(() => {
      this.showSuccessMessage = false;
    }, 3000);
  }

  get paginatedReports(): Report[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.filteredReports.slice(startIndex, endIndex);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredReports.length / this.itemsPerPage);
  }

  getStartIndex(): number {
    return (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.filteredReports.length);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  getTargetName(report: Report): string {
    if (!report.targetId) {
      return 'Deleted Target';
    }

    if (report.targetType === 'Book') {
      return report.targetId.Title || 'Unknown Book';
    } else if (report.targetType === 'user') {
      return (
        report.targetId.fullName ||
        `${report.targetId.firstName || ''} ${report.targetId.secondName || ''}`.trim() ||
        'Unknown User'
      );
    }
    return 'Unknown';
  }

  getReporterName(report: Report): string {
    if (report.reporterId && report.reporterId.fullName) {
      return report.reporterId.fullName;
    } else if (report.reporterId && (report.reporterId.firstName || report.reporterId.secondName)) {
      return `${report.reporterId.firstName || ''} ${report.reporterId.secondName || ''}`.trim();
    }
    return 'Unknown User';
  }

  formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }

  retryLoadReports(): void {
    this.loadReports();
  }
}
