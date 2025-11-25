import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth';
import { SuggestCategoryService } from '../../shared/services/suggest-category';

interface SuggestedCategory {
  _id?: string;
  name: string;
  suggestedBy: {
    _id: string;
    firstName: string;
    secondName: string;
    email: string;
    fullName: string;
  };
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

@Component({
  selector: 'app-suggest-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './suggest-categories.html',
  styleUrls: ['./suggest-categories.css'],
})
export class SuggestedCategories implements OnInit {
  categories: SuggestedCategory[] = [];
  displayedCategories: SuggestedCategory[] = [];

  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalResults: number = 0;

  loading = false;
  modalLoading = false;
  error = '';

  // Toast
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Delete Modal
  showDeleteModal: boolean = false;
  categoryToDelete: SuggestedCategory | null = null;

  constructor(
    private suggestCategoryService: SuggestCategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.suggestCategoryService.getAllSuggestedCategories().subscribe({
      next: (res) => {
        this.categories = res?.data || [];
        this.applyPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error details:', err);
        this.loading = false;
        this.error = err.error?.message || 'Failed to load suggested categories';
        this.showToast(this.error, 'error');
      },
    });
  }
  applyPagination(): void {
    this.totalResults = this.categories.length;
    const totalPages = Math.max(1, Math.ceil(this.totalResults / this.itemsPerPage));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCategories = this.categories.slice(start, end);
  }

  // ---------- Toast ----------
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 3000);
  }

  // ---------- Retry ----------
  retryLoadCategories(): void {
    this.loadCategories();
  }

  // ---------- Delete ----------
  openDeleteModal(category: SuggestedCategory): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) return;

    this.modalLoading = true;

    this.suggestCategoryService.deleteSuggestCategory(this.categoryToDelete._id!).subscribe({
      next: (res) => {
        const deletedCategory = res?.data;

        if (deletedCategory && deletedCategory.isDeleted) {
          this.categories = this.categories.filter((c) => c._id !== this.categoryToDelete!._id);
          this.applyPagination();
          this.showDeleteModal = false;
          this.modalLoading = false;
          this.showToast('Suggested category deleted successfully!', 'success');
        } else {
          this.modalLoading = false;
          this.showToast('Failed to delete suggested category', 'error');
        }
      },
      error: (err) => {
        console.error('Delete error:', err);
        this.modalLoading = false;
        this.showToast(err.error?.message || 'Failed to delete suggested category', 'error');
      },
    });
  }

  // ---------- Pagination ----------
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
    this.applyPagination();
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.totalResults / this.itemsPerPage)) this.currentPage++;
    this.applyPagination();
  }

  // ---------- Helper Methods for Template ----------
  getTotalPages(): number {
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  isLastPage(): boolean {
    return this.currentPage === this.getTotalPages();
  }
}
