import { CommonModule } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UsersService, User, DeleteUserResponse } from '../../shared/services/users';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-userss',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users.html',
  styleUrls: ['./users.css'],
})
export class Users implements OnInit, OnDestroy {
  searchTerm: string = '';
  sortBy: string = 'name';
  roleFilter: string = 'all';
  statusFilter: string = 'all';

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalResults: number = 0;
  loading: boolean = false;
  searchLoading: boolean = false;
  error: string | null = null;

  users: User[] = [];

  private searchSubject = new Subject<string>();

  // Modals
  showRoleModal: boolean = false;
  showConfirmModal: boolean = false;
  showDeleteModal: boolean = false;

  // Selected users for modals
  userForRoleChange: User | null = null;
  userForConfirmation: User | null = null;
  userForDeletion: User | null = null;

  // Modal loading states
  modalLoading: boolean = false;

  // Toast
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  constructor(private usersService: UsersService) {}

  ngOnInit(): void {
    this.loadUsers();

    // Setup search debounce
    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      this.loadUsers();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  loadUsers(): void {
    if (this.searchTerm.trim()) {
      this.searchLoading = true;
    } else {
      this.loading = true;
    }

    this.error = null;

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
          this.searchLoading = false;
        },
        error: (error) => {
          console.error('Failed to load users:', error);
          this.error = error.error?.message || 'Failed to load users';
          this.loading = false;
          this.searchLoading = false;
          this.showToast('Failed to load users', 'error');
        },
      });
  }

  get filteredUsers(): User[] {
    let filtered = [...this.users];

    // Apply status filter locally
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

  get visiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const pages: (number | string)[] = [];

    if (total <= 7) {
      for (let i = 1; i <= total; i++) pages.push(i);
    } else {
      if (current <= 4) {
        pages.push(1, 2, 3, 4, 5, '...', total);
      } else if (current >= total - 3) {
        pages.push(1, '...', total - 4, total - 3, total - 2, total - 1, total);
      } else {
        pages.push(1, '...', current - 1, current, current + 1, '...', total);
      }
    }
    return pages;
  }

  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  onRoleFilter(): void {
    this.currentPage = 1;
    this.loadUsers();
  }

  onStatusFilter(): void {
    this.currentPage = 1;
  }

  onSortChange(): void {
    // Local sort only, no API call needed
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.roleFilter = 'all';
    this.statusFilter = 'all';
    this.sortBy = 'name';
    this.currentPage = 1;
    this.loadUsers();
  }

  // ---------- Toast ----------
  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 4000);
  }

  // ---------- Role Change Modal ----------
  openRoleModal(user: User): void {
    if (user.role === 'admin') {
      this.showToast('User is already an admin', 'error');
      return;
    }
    this.userForRoleChange = user;
    this.showRoleModal = true;
  }

  closeRoleModal(): void {
    this.showRoleModal = false;
    this.userForRoleChange = null;
  }

  confirmRoleChange(): void {
    if (!this.userForRoleChange) return;

    this.modalLoading = true;

    this.usersService
      .promoteToAdmin(this.userForRoleChange._id)
      .subscribe({
        next: (updatedUser) => {
          this.userForRoleChange!.role = 'admin';
          this.showToast('User promoted to admin successfully!', 'success');
          this.loadUsers();
          this.closeRoleModal();
        },
        error: (error) => {
          this.showToast(error.error?.message || 'Failed to promote user', 'error');
          this.modalLoading = false;
        },
      })
      .add(() => (this.modalLoading = false));
  }

  // ---------- Confirmation Modal ----------
  openConfirmModal(user: User): void {
    if (user.isConfirmed) {
      this.showToast('User is already confirmed', 'error');
      return;
    }
    this.userForConfirmation = user;
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
    this.userForConfirmation = null;
  }

  confirmUser(): void {
    if (!this.userForConfirmation) return;

    this.modalLoading = true;

    this.usersService
      .confirmUser(this.userForConfirmation._id)
      .subscribe({
        next: (updatedUser) => {
          this.userForConfirmation!.isConfirmed = true;
          this.showToast('User confirmed successfully!', 'success');
          this.loadUsers();
          this.closeConfirmModal();
        },
        error: (error) => {
          this.showToast(error.error?.message || 'Failed to confirm user', 'error');
          this.modalLoading = false;
        },
      })
      .add(() => (this.modalLoading = false));
  }

  // ---------- Delete Modal ----------
  openDeleteModal(user: User): void {
    if (user.role === 'admin') {
      this.showToast('Cannot delete admin users', 'error');
      return;
    }
    this.userForDeletion = user;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.userForDeletion = null;
  }

  confirmDelete(): void {
    if (!this.userForDeletion) return;

    this.modalLoading = true;

    this.usersService
      .deleteUser(this.userForDeletion._id)
      .subscribe({
        next: (response: DeleteUserResponse) => {
          this.showToast(response.message || 'User deleted successfully!', 'success');
          this.loadUsers();
          this.closeDeleteModal();
        },
        error: (error) => {
          this.showToast(error.error?.message || 'Failed to delete user', 'error');
          this.modalLoading = false;
        },
      })
      .add(() => (this.modalLoading = false));
  }

  // ---------- Pagination ----------
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadUsers();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadUsers();
    }
  }

  goToPage(page: number | string): void {
    if (
      typeof page === 'number' &&
      page >= 1 &&
      page <= this.totalPages &&
      page !== this.currentPage
    ) {
      this.currentPage = page;
      this.loadUsers();
    }
  }

  isLastPage(): boolean {
    return this.currentPage >= this.totalPages;
  }

  // Helper methods for UI
  getRoleBadgeClass(role: string): string {
    return role === 'admin' ? 'bg-danger-light text-danger' : 'bg-secondary-light text-secondary';
  }

  getStatusBadgeClass(isConfirmed: boolean): string {
    return isConfirmed ? 'bg-success-light text-success' : 'bg-warning-light text-warning';
  }

  getUserFullName(user: User): string {
    return `${user.firstName} ${user.secondName}`.trim();
  }

  // Check if user can be deleted (not admin)
  canDeleteUser(user: User): boolean {
    return user.role !== 'admin';
  }
}
