import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { BooksService, Book, Category } from '../../shared/services/books';
import { AuthService } from '../../shared/services/auth';

@Component({
  selector: 'app-books',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css'],
})
export class Books implements OnInit, OnDestroy {
  // Data
  books: Book[] = [];
  categories: Category[] = [];

  // Search and Filters
  searchQuery: string = '';
  selectedCategory: string = '';
  selectedStatus: string = '';
  selectedTransactionType: string = '';

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalResults: number = 0;
  totalPages: number = 0;

  // Loading States
  loading: boolean = false;
  modalLoading: boolean = false;
  error: string = '';

  // Toast Notification
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Modals State
  showDeleteModal: boolean = false;
  bookToDelete: Book | null = null;

  showRestoreModal: boolean = false;
  bookToRestore: Book | null = null;

  showModerationModal: boolean = false;
  bookToModerate: Book | null = null;
  moderationAction: 'approve' | 'unapprove' = 'approve';

  // Cleanup
  private destroy$ = new Subject<void>();

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initializeComponent();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // ════════════════════════════════════════════════════════════════
  // 🎯 INITIALIZATION
  // ════════════════════════════════════════════════════════════════

  private initializeComponent(): void {
    this.loadCategories();
    this.loadBooks();
  }

  // ════════════════════════════════════════════════════════════════
  // 📚 DATA LOADING
  // ════════════════════════════════════════════════════════════════

  loadCategories(): void {
    const token = this.authService.getAccessToken();
    if (!token) return;

    this.booksService
      .getCategories(token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response: any) => {
          // Handle different response structures
          if (Array.isArray(response)) {
            this.categories = response;
          } else if (response?.categories) {
            this.categories = response.categories;
          } else if (response?.data?.categories) {
            this.categories = response.data.categories;
          } else {
            this.categories = [];
          }
        },
        error: (err) => {
          console.error('Error loading categories:', err);
          // Fallback to default categories
          this.categories = [
            { _id: '69035f89eaacbd26c8796758', name: 'Science Fiction' },
            { _id: '69035fa6eaacbd26c8796760', name: 'Biography' },
            { _id: '69035fc0eaacbd26c8796764', name: 'Education' },
            { _id: '69035fe8eaacbd26c8796768', name: 'Self Development' },
          ];
        },
      });
  }

  loadBooks(): void {
    this.loading = true;
    this.error = '';

    const token = this.authService.getAccessToken();
    if (!token) {
      this.error = 'Authentication required';
      this.loading = false;
      this.router.navigate(['/login']);
      return;
    }

    // Map UI status to backend status
    const backendStatus = this.mapStatusToBackend(this.selectedStatus);

    this.booksService
      .getAllBooksIncludingAll(
        token,
        this.currentPage,
        this.itemsPerPage,
        this.searchQuery || undefined,
        this.selectedCategory || undefined,
        backendStatus,
        this.selectedTransactionType || undefined,
        true
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.books = response?.books || [];
          this.totalResults = Number(response?.total ?? 0);
          this.totalPages = Number(
            response?.totalPages ?? Math.ceil(this.totalResults / this.itemsPerPage) ?? 0
          );
          if (response?.page) {
            this.currentPage = Number(response.page);
          }
          this.loading = false;
        },
        error: (err) => {
          console.error('Error loading books:', err);
          this.loading = false;
          this.error = this.getErrorMessage(err);
          this.showToast(this.error, 'error');

          if (err.status === 401 || err.status === 403) {
            this.authService.logout();
            this.router.navigate(['/login']);
          }
        },
      });
  }

  // ════════════════════════════════════════════════════════════════
  // 🔍 FILTERS & SEARCH
  // ════════════════════════════════════════════════════════════════

  onSearch(event: Event): void {
    const target = event.target as HTMLInputElement;
    this.searchQuery = target.value;
    this.currentPage = 1;
    this.loadBooks();
  }

  onCategoryFilter(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.loadBooks();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.loadBooks();
  }

  onTransactionTypeFilter(type: string): void {
    this.selectedTransactionType = type;
    this.currentPage = 1;
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedTransactionType = '';
    this.currentPage = 1;
    this.loadBooks();
  }

  // ════════════════════════════════════════════════════════════════
  // 🗑️ DELETE OPERATIONS
  // ════════════════════════════════════════════════════════════════

  openDeleteModal(book: Book): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  confirmDeleteBook(): void {
    if (!this.bookToDelete) return;

    this.modalLoading = true;
    const token = this.authService.getAccessToken();

    if (!token) {
      this.showToast('Authentication required', 'error');
      this.modalLoading = false;
      return;
    }

    this.booksService
      .deleteBook(this.bookToDelete._id, token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBooks();
          this.closeDeleteModal();
          this.modalLoading = false;
          this.showToast('Book deleted successfully!', 'success');
        },
        error: (err) => {
          console.error('Error deleting book:', err);
          this.modalLoading = false;
          this.showToast(this.getErrorMessage(err), 'error');
        },
      });
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  // ════════════════════════════════════════════════════════════════
  // 🔄 RESTORE OPERATIONS
  // ════════════════════════════════════════════════════════════════

  openRestoreModal(book: Book): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.bookToRestore = book;
    this.showRestoreModal = true;
  }

  confirmRestoreBook(): void {
    if (!this.bookToRestore) return;

    this.modalLoading = true;
    const token = this.authService.getAccessToken();

    if (!token) {
      this.showToast('Authentication required', 'error');
      this.modalLoading = false;
      return;
    }

    this.booksService
      .restoreBook(this.bookToRestore._id, token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBooks();
          this.closeRestoreModal();
          this.modalLoading = false;
          this.showToast('Book restored successfully!', 'success');
        },
        error: (err) => {
          console.error('Error restoring book:', err);
          this.modalLoading = false;
          this.showToast(this.getErrorMessage(err), 'error');
        },
      });
  }

  closeRestoreModal(): void {
    this.showRestoreModal = false;
    this.bookToRestore = null;
  }

  // ════════════════════════════════════════════════════════════════
  // ✅ MODERATION OPERATIONS
  // ════════════════════════════════════════════════════════════════

  openModerationModal(book: Book): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.bookToModerate = book;
    this.moderationAction = book.IsModerated ? 'unapprove' : 'approve';
    this.showModerationModal = true;
  }

  confirmModeration(): void {
    if (!this.bookToModerate) return;

    const token = this.authService.getAccessToken();
    if (!token) {
      this.showToast('Authentication required', 'error');
      return;
    }

    this.modalLoading = true;
    const body = { IsModerated: !this.bookToModerate.IsModerated };

    this.booksService
      .updateBook(this.bookToModerate._id, body, token)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.loadBooks();
          this.closeModerationModal();
          this.modalLoading = false;
          const action = this.bookToModerate!.IsModerated ? 'unapproved' : 'approved';
          this.showToast(`Book ${action} successfully!`, 'success');
        },
        error: (err) => {
          console.error('Error updating book moderation:', err);
          this.modalLoading = false;
          this.showToast('Failed to update book moderation', 'error');
        },
      });
  }

  closeModerationModal(): void {
    this.showModerationModal = false;
    this.bookToModerate = null;
  }

  // ════════════════════════════════════════════════════════════════
  // 📄 PAGINATION
  // ════════════════════════════════════════════════════════════════

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  goToPage(page: number | string): void {
    if (typeof page !== 'number') return;
    if (page === this.currentPage) return;
    if (page < 1 || page > this.totalPages) return;
    this.currentPage = page;
    this.loadBooks();
  }

  getVisiblePages(): (number | string)[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const maxButtons = 7;

    if (total <= maxButtons) {
      return Array.from({ length: total }, (_, i) => i + 1);
    }

    const pages: (number | string)[] = [];
    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    pages.push(1);

    if (left > 2) {
      pages.push('...');
    }

    for (let p = left; p <= right; p++) {
      pages.push(p);
    }

    if (right < total - 1) {
      pages.push('...');
    }

    pages.push(total);

    return pages.filter((v, i, arr) => arr.indexOf(v) === i);
  }

  getStartIndex(): number {
    return this.totalResults === 0 ? 0 : (this.currentPage - 1) * this.itemsPerPage + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalResults);
  }

  // ════════════════════════════════════════════════════════════════
  // 🎨 UI HELPERS
  // ════════════════════════════════════════════════════════════════

  getSelectedCategoryName(): string {
    if (!this.selectedCategory) return 'Category';
    const category = this.categories.find((c) => c._id === this.selectedCategory);
    return category?.name ?? 'Category';
  }

  getSelectedStatusName(): string {
    if (!this.selectedStatus) return 'Status';
    const statusMap: Record<string, string> = {
      active: 'Active',
      inactive: 'Inactive',
      sold: 'Sold',
      donated: 'Donated',
      borrowed: 'Borrowed',
      available: 'Available',
    };
    return statusMap[this.selectedStatus] ?? this.selectedStatus;
  }

  getSelectedTransactionTypeName(): string {
    if (!this.selectedTransactionType) return 'Transaction Type';
    return this.getTransactionTypeDisplay(this.selectedTransactionType);
  }

  getTransactionTypeDisplay(type: string): string {
    const typeMap: Record<string, string> = {
      toSale: 'Sell',
      toBorrow: 'Borrow',
      toExchange: 'Swap',
      toDonate: 'Giveaway',
    };
    return typeMap[type] ?? type;
  }

  getPriceDisplay(book: Book): string {
    if (book.TransactionType === 'toSale' && book.Price) {
      return `$${book.Price}`;
    } else if (book.TransactionType === 'toBorrow' && book.PricePerDay) {
      return `$${book.PricePerDay}/day`;
    }
    return 'N/A';
  }

  getOwnerName(book: Book): string {
    const fullName = `${book.UserID?.firstName || ''} ${book.UserID?.secondName || ''}`.trim();
    return fullName || 'Unknown User';
  }

  getBookStatus(book: Book): string {
    if (book.isDeleted) return 'Deleted';
    if (book.isSold) return 'Sold';
    if (book.isDonated) return 'Donated';
    if (book.isBorrowedNow) return 'Borrowed';
    return 'Available';
  }

  getStatusBadgeClass(book: Book): string {
    if (book.isDeleted) return 'bg-danger-light text-danger';
    if (book.isSold) return 'bg-info-light text-info';
    if (book.isDonated) return 'bg-secondary-light text-secondary';
    if (book.isBorrowedNow) return 'bg-warning-light text-warning';
    return 'bg-success-light text-success';
  }

  // ════════════════════════════════════════════════════════════════
  // 🔔 TOAST NOTIFICATIONS
  // ════════════════════════════════════════════════════════════════

  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => {
      this.showToastMessage = false;
    }, 3000);
  }

  // ════════════════════════════════════════════════════════════════
  // 🛠️ UTILITY METHODS
  // ════════════════════════════════════════════════════════════════

  private mapStatusToBackend(uiStatus: string): string | undefined {
    const statusMap: Record<string, string> = {
      active: 'available',
      inactive: 'deleted',
    };
    return statusMap[uiStatus] ?? (uiStatus || undefined);
  }

  private getErrorMessage(error: any): string {
    if (error?.status === 401) return 'Unauthorized - Please login again';
    if (error?.status === 403) return 'Access denied - Admin role required';
    if (error?.status === 404) return 'Books not found';
    if (error?.status === 500) return 'Server error - Please try again later';
    return error?.message || 'Failed to load books';
  }

  isLastPage(): boolean {
    return this.currentPage === this.totalPages;
  }

  getTotalPages(): number {
    return this.totalPages;
  }
}
