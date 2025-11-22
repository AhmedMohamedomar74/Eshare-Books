import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../shared/services/auth';
import { Subscription } from 'rxjs';
import { BooksService } from '../../shared/services/books';
import { UsersResponse, UsersService } from '../../shared/services/users';
import { CategoriesService } from '../../shared/services/categories';
import { ReportsService } from '../../shared/services/reports';

interface StatCard {
  label: string;
  value: string | number;
  icon: string;
  iconColor: string;
  loading?: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit, OnDestroy {
  stats: StatCard[] = [
    {
      label: 'Total Books',
      value: '0',
      icon: 'bi bi-book',
      iconColor: 'blue',
      loading: true,
    },
    {
      label: 'Total Users',
      value: '0',
      icon: 'bi bi-people',
      iconColor: 'green',
      loading: true,
    },
    {
      label: 'Categories',
      value: '0',
      icon: 'bi bi-tags',
      iconColor: 'orange',
      loading: true,
    },
    {
      label: 'Pending Reports',
      value: '0',
      icon: 'bi bi-file-earmark-text',
      iconColor: 'red',
      loading: true,
    },
  ];

  private subscriptions = new Subscription();

  constructor(
    private booksService: BooksService,
    private usersService: UsersService,
    private categoriesService: CategoriesService,
    private reportsService: ReportsService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadDashboardData();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  private loadDashboardData(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;

    // Load books statistics
    this.subscriptions.add(
      this.booksService.getAllBooksAdmin(token, { limit: 100 }).subscribe({
        next: (response: any) => {
          this.stats[0].value = response.total || response.books?.length || 0;
          this.stats[0].loading = false;
        },
        error: (error) => {
          console.error('Error loading books:', error);
          this.stats[0].value = 'Error';
          this.stats[0].loading = false;
        },
      })
    );

    // Load users statistics - FIXED
    this.subscriptions.add(
      this.usersService.getAllUsers({ limit: 100 }).subscribe({
        next: (response: UsersResponse) => {
          if (response?.pagination?.totalCount !== undefined) {
            this.stats[1].value = response.pagination.totalCount;
          } else {
            this.stats[1].value = response.users?.length || 0;
          }
          this.stats[1].loading = false;
        },
        error: (error) => {
          console.error('Error loading users:', error);
          this.stats[1].value = 'Error';
          this.stats[1].loading = false;
        },
      })
    );

    // Load categories
    this.subscriptions.add(
      this.categoriesService.getAllCategories().subscribe({
        next: (response: any) => {
          const categories = response.data || response;
          this.stats[2].value = categories.length || 0;
          this.stats[2].loading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.stats[2].value = 'Error';
          this.stats[2].loading = false;
        },
      })
    );

    // Load pending reports
    this.subscriptions.add(
      this.reportsService.getAllReports(token).subscribe({
        next: (response: any) => {
          const reports = response.data || response;
          const pendingReports = Array.isArray(reports)
            ? reports.filter((report: any) => report.status === 'Pending').length
            : 0;
          this.stats[3].value = pendingReports;
          this.stats[3].loading = false;
        },
        error: (error) => {
          console.error('Error loading reports:', error);
          this.stats[3].value = 'Error';
          this.stats[3].loading = false;
        },
      })
    );
  }
}
