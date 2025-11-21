import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService, User } from '../../shared/services/users';

@Component({
  selector: 'app-userss',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit {
  searchTerm: string = '';
  sortBy: string = 'name';
  roleFilter: string = 'all';
  statusFilter: string = 'all';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalResults: number = 0;
  loading: boolean = false;

  users: User[] = [];

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.usersService
      .getAllUsers({
        page: this.currentPage,
        limit: this.itemsPerPage,
        search: this.searchTerm,
        role: this.roleFilter !== 'all' ? (this.roleFilter as 'admin' | 'user') : undefined,
      })
      .subscribe({
        next: (response) => {
          this.users = response.users;
          this.totalResults = response.pagination.totalCount;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to load users:', error);
          this.loading = false;
        },
      });
  }

  get filteredUsers(): User[] {
    let filtered = [...this.users];

    // Apply status filter locally since API doesn't support it
    if (this.statusFilter !== 'all') {
      const isConfirmed = this.statusFilter === 'confirmed';
      filtered = filtered.filter((u) => u.isConfirmed === isConfirmed);
    }

    // Apply local sorting
    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return (a.firstName + ' ' + a.secondName).localeCompare(b.firstName + ' ' + b.secondName);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'date':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        default:
          return 0;
      }
    });

    return filtered;
  }

  get paginatedUsers(): User[] {
    return this.filteredUsers;
  }

  get totalPages(): number {
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  get startIndex(): number {
    return this.totalResults === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  get endIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalResults);
  }

  get visiblePages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: number[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, 0, total);
      } else if (current >= total - 3) {
        pages.push(1, 0, total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, 0, current - 1, current, current + 1, 0, total);
      }
    }

    return pages.filter((p) => p > 0);
  }

  onSearch(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onRoleFilter(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onStatusFilter(): void {
    // Local filter only, no API call needed
  }

  onSortChange(): void {
    // Local sort only, no API call needed
  }

  addNewUser(): void {
    console.log('Add new user clicked');
  }

  toggleRole(user: User): void {
    this.loading = true;
    if (user.role === 'user') {
      this.usersService.promoteToAdmin(user._id).subscribe({
        next: (updatedUser) => {
          user.role = 'admin';
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to promote user:', error);
          this.loading = false;
        },
      });
    } else {
      this.usersService.demoteToUser(user._id).subscribe({
        next: (updatedUser) => {
          user.role = 'user';
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to demote user:', error);
          this.loading = false;
        },
      });
    }
  }

  toggleConfirmation(user: User): void {
    this.loading = true;
    if (!user.isConfirmed) {
      this.usersService.confirmUser(user._id).subscribe({
        next: (updatedUser) => {
          user.isConfirmed = true;
          this.loading = false;
        },
        error: (error) => {
          console.error('Failed to confirm user:', error);
          this.loading = false;
        },
      });
    }
    // Note: We don't have unconfirm functionality in the API
  }

  deleteUser(user: User): void {
    if (
      confirm(
        `Are you sure you want to delete ${user.firstName} ${user.secondName}? This action cannot be undone.`
      )
    ) {
      this.loading = true;
      this.usersService.deleteUser(user._id).subscribe({
        next: () => {
          this.loadUsers(); // Reload the list
        },
        error: (error) => {
          console.error('Failed to delete user:', error);
          this.loading = false;
        },
      });
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }
}
