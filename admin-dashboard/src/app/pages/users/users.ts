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
    this.currentPage = 1;
  }

  onSortChange(): void {
    // Local sort only, no API call needed
  }

  // ---------- Toast ----------
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 3000);
  }

  // ---------- Role Change Modal ----------
  openRoleModal(user: User): void {
    this.userForRoleChange = user;
    this.showRoleModal = true;
  }

  confirmRoleChange(): void {
    if (!this.userForRoleChange) return;

    this.modalLoading = true;
    const newRole = this.userForRoleChange.role === 'user' ? 'admin' : 'user';
    const action = newRole === 'admin' ? 'promote' : 'demote';

    const serviceCall =
      newRole === 'admin'
        ? this.usersService.promoteToAdmin(this.userForRoleChange._id)
        : this.usersService.demoteToUser(this.userForRoleChange._id);

    serviceCall.subscribe({
      next: (updatedUser) => {
        this.userForRoleChange!.role = newRole;
        this.showRoleModal = false;
        this.modalLoading = false;
        this.showToast(
          `User ${action === 'promote' ? 'promoted to admin' : 'demoted to user'} successfully!`,
          'success'
        );
      },
      error: (error) => {
        console.error(`Failed to ${action} user:`, error);
        this.modalLoading = false;
        this.showToast(`Failed to ${action} user`, 'error');
      },
    });
  }

  // ---------- Confirmation Modal ----------
  openConfirmModal(user: User): void {
    this.userForConfirmation = user;
    this.showConfirmModal = true;
  }

  confirmUser(): void {
    if (!this.userForConfirmation) return;

    this.modalLoading = true;
    this.usersService.confirmUser(this.userForConfirmation._id).subscribe({
      next: (updatedUser) => {
        this.userForConfirmation!.isConfirmed = true;
        this.showConfirmModal = false;
        this.modalLoading = false;
        this.showToast('User confirmed successfully!', 'success');
      },
      error: (error) => {
        console.error('Failed to confirm user:', error);
        this.modalLoading = false;
        this.showToast('Failed to confirm user', 'error');
      },
    });
  }

  // ---------- Delete Modal ----------
  openDeleteModal(user: User): void {
    this.userForDeletion = user;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (!this.userForDeletion) return;

    this.modalLoading = true;
    this.usersService.deleteUser(this.userForDeletion._id).subscribe({
      next: () => {
        this.loadUsers(); // Reload the list
        this.showDeleteModal = false;
        this.modalLoading = false;
        this.showToast('User deleted successfully!', 'success');
      },
      error: (error) => {
        console.error('Failed to delete user:', error);
        this.modalLoading = false;
        this.showToast('Failed to delete user', 'error');
      },
    });
  }

  // ---------- Pagination ----------
  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
      this.loadUsers();
    }
  }
}
