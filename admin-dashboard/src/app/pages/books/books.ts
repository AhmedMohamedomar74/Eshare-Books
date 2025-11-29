import { Component, OnInit, OnDestroy } from '@angular/core';
import { BooksService, Book } from '../../shared/services/books';
import { AuthService } from '../../shared/services/auth';
import { CategoriesService } from '../../shared/services/categories';
import { CommonModule } from '@angular/common';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

interface Category {
  _id: string;
  name: string;
}

@Component({
  selector: 'app-books',
  imports: [CommonModule],
  templateUrl: './books.html',
  styleUrls: ['./books.css'],
})
export class Books implements OnInit, OnDestroy {
  books: Book[] = [];
  categories: Category[] = [];
  loading = true;
  searchLoading = false;
  error: string | null = null;

  // Filters
  searchQuery = '';
  selectedCategory = '';
  selectedStatus = '';
  selectedTransactionType = '';

  // Subject for search debounce
  private searchSubject = new Subject<string>();

  // Dropdown states
  categoryDropdownOpen = false;
  statusDropdownOpen = false;
  transactionTypeDropdownOpen = false;

  // Pagination
  currentPage = 1;
  limit = 10;
  totalResults = 0;

  // Modals
  showDeleteModal = false;
  showRestoreModal = false;
  showModerationModal = false;
  showEditCategoryModal = false;
  bookToDelete: Book | null = null;
  bookToRestore: Book | null = null;
  bookToModerate: Book | null = null;
  bookToEditCategory: Book | null = null;
  selectedNewCategory = '';
  moderationAction: 'approve' | 'unapprove' = 'approve';
  modalLoading = false;

  // Toast
  showToastMessage = false;
  toastMessage = '';
  toastType: 'success' | 'error' = 'success';

  constructor(
    private booksService: BooksService,
    private authService: AuthService,
    private categoryService: CategoriesService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadBooks();

    this.searchSubject.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      this.currentPage = 1;
      this.loadBooks();
    });
  }

  ngOnDestroy(): void {
    this.searchSubject.complete();
  }

  canEditBook(book: Book): boolean {
    return !book.isDeleted && !book.isSold && !book.isDonated;
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (res) => {
        this.categories = res.data || [];
        console.log('Categories loaded:', this.categories);
      },
      error: (err) => {
        console.error('Error loading categories:', err);
        this.categories = [];
      },
    });
  }

  loadBooks(): void {
    if (this.searchQuery.trim()) {
      this.searchLoading = true;
    } else {
      this.loading = true;
    }

    this.error = null;

    const token = this.authService.getAccessToken()!;
    const params: any = {
      page: this.currentPage,
      limit: this.limit,
    };

    // Search by title or bookId
    if (this.searchQuery.trim()) {
      // Check if it's a valid bookId (24 character hex string)
      const isBookId = /^[0-9a-fA-F]{24}$/.test(this.searchQuery.trim());
      if (isBookId) {
        params.bookId = this.searchQuery.trim();
      } else {
        params.title = this.searchQuery.trim();
      }
    }

    if (this.selectedCategory) params.category = this.selectedCategory;
    if (this.selectedTransactionType) params.transactionType = this.selectedTransactionType;
    if (this.selectedStatus) params.status = this.selectedStatus;

    this.booksService.getAllBooksAdmin(token, params).subscribe({
      next: (res) => {
        this.books = res.books;
        this.totalResults = res.total;
        this.loading = false;
        this.searchLoading = false;
      },
      error: (err) => {
        this.error = err.error?.message || 'Failed to load books';
        this.loading = false;
        this.searchLoading = false;
      },
    });
  }

  // Filters
  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.searchSubject.next(this.searchQuery);
  }

  // Dropdown Handlers
  toggleCategoryDropdown(): void {
    this.categoryDropdownOpen = !this.categoryDropdownOpen;
    this.statusDropdownOpen = false;
    this.transactionTypeDropdownOpen = false;
  }

  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
    this.categoryDropdownOpen = false;
    this.transactionTypeDropdownOpen = false;
  }

  toggleTransactionTypeDropdown(): void {
    this.transactionTypeDropdownOpen = !this.transactionTypeDropdownOpen;
    this.categoryDropdownOpen = false;
    this.statusDropdownOpen = false;
  }

  closeAllDropdowns(): void {
    this.categoryDropdownOpen = false;
    this.statusDropdownOpen = false;
    this.transactionTypeDropdownOpen = false;
  }

  onCategoryFilter(categoryId: string): void {
    this.selectedCategory = categoryId;
    this.currentPage = 1;
    this.closeAllDropdowns();
    this.loadBooks();
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.currentPage = 1;
    this.closeAllDropdowns();
    this.loadBooks();
  }

  onTransactionTypeFilter(type: string): void {
    this.selectedTransactionType = type;
    this.currentPage = 1;
    this.closeAllDropdowns();
    this.loadBooks();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedCategory = '';
    this.selectedStatus = '';
    this.selectedTransactionType = '';
    this.currentPage = 1;
    this.closeAllDropdowns();
    this.loadBooks();
  }

  // Pagination
  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.loadBooks();
    }
  }

  nextPage(): void {
    if (!this.isLastPage()) {
      this.currentPage++;
      this.loadBooks();
    }
  }

  goToPage(page: number | string): void {
    if (typeof page === 'number' && page !== this.currentPage) {
      this.currentPage = page;
      this.loadBooks();
    }
  }

  isLastPage(): boolean {
    return this.currentPage * this.limit >= this.totalResults;
  }

  getTotalPages(): number {
    return Math.ceil(this.totalResults / this.limit);
  }

  getVisiblePages(): (number | string)[] {
    const total = this.getTotalPages();
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

  getStartIndex(): number {
    return (this.currentPage - 1) * this.limit + 1;
  }

  getEndIndex(): number {
    return Math.min(this.currentPage * this.limit, this.totalResults);
  }

  // Helpers
  getSelectedCategoryName(): string {
    if (!this.selectedCategory) return 'All Categories';
    const cat = this.categories.find((c) => c._id === this.selectedCategory);
    return cat?.name || 'Category';
  }

  getSelectedStatusName(): string {
    const map: any = {
      '': 'All Status',
      available: 'Available',
      borrowed: 'Borrowed',
      sold: 'Sold',
      donated: 'Donated',
      deleted: 'Deleted',
    };
    return map[this.selectedStatus] || 'Status';
  }

  getSelectedTransactionTypeName(): string {
    const map: any = {
      '': 'All Types',
      toSale: 'Sell',
      toBorrow: 'Borrow',
      toDonate: 'Donate',
    };
    return map[this.selectedTransactionType] || 'Type';
  }

  getTransactionTypeDisplay(type: string): string {
    const typeMap: any = {
      toSale: 'Sell',
      toBorrow: 'Borrow',
      toDonate: 'Donate',
    };
    return typeMap[type] || type;
  }

  getPriceDisplay(book: Book): string {
    if (book.TransactionType === 'toSale') return `${book.Price || 0} EGP`;
    if (book.TransactionType === 'toBorrow') return `${book.PricePerDay || 0} EGP/day`;
    if (book.TransactionType === 'toDonate') return 'Free';
    return 'N/A';
  }

  getOwnerName(book: Book): string {
    return `${book.UserID?.firstName || ''} ${book.UserID?.secondName || ''}`.trim() || 'Unknown';
  }

  getBookStatus(book: Book): string {
    if (book.isDeleted) return 'Deleted';
    if (book.isDonated) return 'Donated';
    if (book.isSold) return 'Sold';
    if (book.isBorrowedNow) return 'Borrowed';
    return book.status.charAt(0).toUpperCase() + book.status.slice(1);
  }

  getStatusBadgeClass(book: Book): string {
    if (book.isDeleted) return 'bg-secondary-light text-secondary';
    if (book.isDonated) return 'bg-info-light text-info';
    if (book.isSold) return 'bg-danger-light text-danger';
    if (book.isBorrowedNow) return 'bg-warning-light text-warning';
    if (book.status === 'available') return 'bg-success-light text-success';
    return 'bg-light text-dark';
  }

  // Actions
  openDeleteModal(book: Book): void {
    this.bookToDelete = book;
    this.showDeleteModal = true;
  }

  closeDeleteModal(): void {
    this.showDeleteModal = false;
    this.bookToDelete = null;
  }

  confirmDeleteBook(): void {
    if (!this.bookToDelete) return;
    this.modalLoading = true;
    const token = this.authService.getAccessToken()!;

    this.booksService
      .adminDeleteBook(this.bookToDelete._id, token)
      .subscribe({
        next: () => {
          this.showToast('Book deleted successfully', 'success');
          this.loadBooks();
          this.closeDeleteModal();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Failed to delete book', 'error');
        },
      })
      .add(() => {
        this.modalLoading = false;
      });
  }

  openRestoreModal(book: Book): void {
    this.bookToRestore = book;
    this.showRestoreModal = true;
  }

  closeRestoreModal(): void {
    this.showRestoreModal = false;
    this.bookToRestore = null;
  }

  confirmRestoreBook(): void {
    if (!this.bookToRestore) return;
    this.modalLoading = true;
    const token = this.authService.getAccessToken()!;

    this.booksService
      .adminRestoreBook(this.bookToRestore._id, token)
      .subscribe({
        next: () => {
          this.showToast('Book restored successfully', 'success');
          this.loadBooks();
          this.closeRestoreModal();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Cannot restore book', 'error');
        },
      })
      .add(() => (this.modalLoading = false));
  }

  openModerationModal(book: Book): void {
    this.bookToModerate = book;
    this.moderationAction = book.IsModerated ? 'unapprove' : 'approve';
    this.showModerationModal = true;
  }

  closeModerationModal(): void {
    this.showModerationModal = false;
    this.bookToModerate = null;
  }

  confirmModeration(): void {
    if (!this.bookToModerate) return;
    this.modalLoading = true;
    const token = this.authService.getAccessToken()!;
    const newStatus = this.moderationAction === 'approve';

    this.booksService
      .adminUpdateModeration(this.bookToModerate._id, newStatus, token)
      .subscribe({
        next: () => {
          this.showToast(`Book ${newStatus ? 'approved' : 'unapproved'} successfully`, 'success');
          this.loadBooks();
          this.closeModerationModal();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Failed to update moderation', 'error');
        },
      })
      .add(() => (this.modalLoading = false));
  }

  // Category Edit Modal
  openEditCategoryModal(book: Book): void {
    if (!this.canEditBook(book)) {
      return;
    }
    this.bookToEditCategory = book;
    this.selectedNewCategory = book.categoryId?._id || '';
    this.showEditCategoryModal = true;
  }

  closeEditCategoryModal(): void {
    this.showEditCategoryModal = false;
    this.bookToEditCategory = null;
    this.selectedNewCategory = '';
  }

  onCategorySelect(categoryId: string): void {
    this.selectedNewCategory = categoryId;
  }

  confirmCategoryUpdate(): void {
    if (!this.bookToEditCategory || !this.selectedNewCategory) {
      this.showToast('Please select a category', 'error');
      return;
    }

    this.modalLoading = true;
    const token = this.authService.getAccessToken()!;

    this.booksService
      .adminUpdateBookCategory(this.bookToEditCategory._id, this.selectedNewCategory, token)
      .subscribe({
        next: () => {
          this.showToast('Category updated successfully', 'success');
          this.loadBooks();
          this.closeEditCategoryModal();
        },
        error: (err) => {
          this.showToast(err.error?.message || 'Failed to update category', 'error');
        },
      })
      .add(() => (this.modalLoading = false));
  }

  // Toast
  showToast(message: string, type: 'success' | 'error'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 4000);
  }
}
