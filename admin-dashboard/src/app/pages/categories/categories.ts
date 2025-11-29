import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth';
import { CategoriesService } from '../../shared/services/categories';
import { SuggestCategoryService } from '../../shared/services/suggest-category';

interface Category {
  _id?: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

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
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories implements OnInit {
  // Tab Management
  activeTab: 'categories' | 'suggested' = 'categories';

  // Categories
  categories: Category[] = [];
  displayedCategories: Category[] = [];
  searchQuery: string = '';
  currentPageCategories: number = 1;
  itemsPerPageCategories: number = 5;
  totalResultsCategories: number = 0;

  // Suggested Categories
  suggestedCategories: SuggestedCategory[] = [];
  displayedSuggestedCategories: SuggestedCategory[] = [];
  currentPageSuggested: number = 1;
  itemsPerPageSuggested: number = 10;
  totalResultsSuggested: number = 0;

  loading = false;
  modalLoading = false;
  error = '';

  // Toast
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Add Modal
  showAddModal: boolean = false;
  newCategoryName: string = '';
  addCategoryError: string = '';

  // Edit Modal
  showEditModal: boolean = false;
  editCategoryName: string = '';
  categoryToEdit: Category | null = null;
  editCategoryError: string = '';

  // Delete Modal
  showDeleteModal: boolean = false;
  categoryToDelete: Category | null = null;
  suggestedCategoryToDelete: SuggestedCategory | null = null;

  constructor(
    private categoriesService: CategoriesService,
    private suggestCategoryService: SuggestCategoryService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadSuggestedCategories();
  }

  // ---------- Tab Management ----------
  switchTab(tab: 'categories' | 'suggested'): void {
    this.activeTab = tab;
    this.error = '';
  }

  // ---------- Load Data ----------
  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categoriesService.getAllCategories().subscribe({
      next: (res) => {
        const payload = res?.data ?? res;
        this.categories = Array.isArray(payload) ? payload : [];
        this.applyFilterAndPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.error = 'Failed to load categories';
        this.showToast('Failed to load categories', 'error');
      },
    });
  }

  loadSuggestedCategories(): void {
    this.loading = true;
    this.error = '';

    this.suggestCategoryService.getAllSuggestedCategories().subscribe({
      next: (res) => {
        this.suggestedCategories = res?.data || [];
        this.applySuggestedPagination();
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

  // ---------- Pagination & Filtering ----------
  applyFilterAndPagination(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = query
      ? this.categories.filter((c) => (c.name ?? '').toLowerCase().includes(query))
      : [...this.categories];

    this.totalResultsCategories = filtered.length;
    const totalPages = Math.max(
      1,
      Math.ceil(this.totalResultsCategories / this.itemsPerPageCategories)
    );
    if (this.currentPageCategories > totalPages) this.currentPageCategories = totalPages;

    const start = (this.currentPageCategories - 1) * this.itemsPerPageCategories;
    const end = start + this.itemsPerPageCategories;
    this.displayedCategories = filtered.slice(start, end);
  }

  applySuggestedPagination(): void {
    this.totalResultsSuggested = this.suggestedCategories.length;
    const totalPages = Math.max(
      1,
      Math.ceil(this.totalResultsSuggested / this.itemsPerPageSuggested)
    );
    if (this.currentPageSuggested > totalPages) this.currentPageSuggested = totalPages;

    const start = (this.currentPageSuggested - 1) * this.itemsPerPageSuggested;
    const end = start + this.itemsPerPageSuggested;
    this.displayedSuggestedCategories = this.suggestedCategories.slice(start, end);
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPageCategories = 1;
    this.applyFilterAndPagination();
  }

  // ---------- Validation Methods ----------
  private isValidCategoryName(name: string): boolean {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      return false;
    }

    const hasNumbers = /\d/.test(trimmedName);
    if (hasNumbers) {
      return false;
    }

    return true;
  }

  private getValidationErrorMessage(name: string): string {
    const trimmedName = name.trim();

    if (trimmedName.length < 3) {
      return 'Category name must be at least 3 characters long';
    }

    if (/\d/.test(trimmedName)) {
      return 'Category name cannot contain numbers';
    }

    return '';
  }

  // ---------- Check if category exists ----------
  private checkCategoryExists(name: string, excludeCategory?: Category): boolean {
    const trimmedName = name.trim().toLowerCase();
    return this.categories.some((category) => {
      // If we're editing, exclude the current category from the check
      if (excludeCategory && category._id === excludeCategory._id) {
        return false;
      }
      return category.name.toLowerCase() === trimmedName;
    });
  }

  // ---------- Toast ----------
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 3000);
  }

  // ---------- Retry ----------
  retryLoad(): void {
    if (this.activeTab === 'categories') {
      this.loadCategories();
    } else {
      this.loadSuggestedCategories();
    }
  }

  // ---------- Add Category ----------
  openAddCategoryModal(): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.newCategoryName = '';
    this.addCategoryError = '';
    this.showAddModal = true;
  }

  confirmAddCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;

    this.addCategoryError = '';

    if (!this.isValidCategoryName(name)) {
      this.addCategoryError = this.getValidationErrorMessage(name);
      return;
    }

    // Check if category already exists (case insensitive)
    if (this.checkCategoryExists(name)) {
      this.addCategoryError = 'Category already exists!';
      return;
    }

    this.modalLoading = true;

    this.categoriesService.createCategory({ name }).subscribe({
      next: (res) => {
        const newCat = res?.data ?? res;
        this.categories.push(newCat);
        this.applyFilterAndPagination();
        this.showAddModal = false;
        this.modalLoading = false;
        this.newCategoryName = '';
        this.addCategoryError = '';
        this.showToast('Category added successfully!', 'success');
      },
      error: (err) => {
        this.modalLoading = false;
        // If backend returns conflict error, show appropriate message
        if (err.status === 409 || err.error?.message?.includes('exists')) {
          this.addCategoryError = 'Category already exists!';
        } else {
          this.showToast('Failed to add category', 'error');
        }
      },
    });
  }

  // ---------- Edit Category ----------
  openEditModal(category: Category): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.categoryToEdit = category;
    this.editCategoryName = category.name;
    this.editCategoryError = '';
    this.showEditModal = true;
  }

  confirmEditCategory(): void {
    if (!this.categoryToEdit) return;
    const name = this.editCategoryName.trim();
    if (!name) return;

    this.editCategoryError = '';

    if (!this.isValidCategoryName(name)) {
      this.editCategoryError = this.getValidationErrorMessage(name);
      return;
    }

    // Check if the name actually changed
    if (this.categoryToEdit.name.toLowerCase() === name.toLowerCase()) {
      this.showEditModal = false;
      return;
    }

    // Check if category with new name already exists (excluding current category)
    if (this.checkCategoryExists(name, this.categoryToEdit)) {
      this.editCategoryError = 'Category with this name already exists!';
      return;
    }

    this.modalLoading = true;

    this.categoriesService.updateCategory(this.categoryToEdit._id!, { name }).subscribe({
      next: () => {
        this.categoryToEdit!.name = name;
        this.applyFilterAndPagination();
        this.showEditModal = false;
        this.modalLoading = false;
        this.editCategoryError = '';
        this.showToast('Category updated successfully!', 'success');
      },
      error: (err) => {
        this.modalLoading = false;
        // If backend returns conflict error, show appropriate message
        if (err.status === 409 || err.error?.message?.includes('exists')) {
          this.editCategoryError = 'Category with this name already exists!';
        } else {
          this.showToast('Failed to update category', 'error');
        }
      },
    });
  }

  // ---------- Delete Category ----------
  openDeleteCategoryModal(category: Category): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.categoryToDelete = category;
    this.suggestedCategoryToDelete = null;
    this.showDeleteModal = true;
  }

  openDeleteSuggestedModal(category: SuggestedCategory): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.suggestedCategoryToDelete = category;
    this.categoryToDelete = null;
    this.showDeleteModal = true;
  }

  confirmDelete(): void {
    if (this.categoryToDelete) {
      this.confirmDeleteCategory();
    } else if (this.suggestedCategoryToDelete) {
      this.confirmDeleteSuggestedCategory();
    }
  }

  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) return;

    this.modalLoading = true;

    this.categoriesService.deleteCategory(this.categoryToDelete._id!).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c._id !== this.categoryToDelete!._id);
        this.applyFilterAndPagination();
        this.showDeleteModal = false;
        this.modalLoading = false;
        this.showToast('Category deleted successfully!', 'success');
      },
      error: () => {
        this.modalLoading = false;
        this.showToast('Failed to delete category', 'error');
      },
    });
  }

  confirmDeleteSuggestedCategory(): void {
    if (!this.suggestedCategoryToDelete) return;

    this.modalLoading = true;

    this.suggestCategoryService
      .deleteSuggestCategory(this.suggestedCategoryToDelete._id!)
      .subscribe({
        next: (res) => {
          const deletedCategory = res?.data;

          if (deletedCategory && deletedCategory.isDeleted) {
            this.suggestedCategories = this.suggestedCategories.filter(
              (c) => c._id !== this.suggestedCategoryToDelete!._id
            );
            this.applySuggestedPagination();
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
    if (this.activeTab === 'categories') {
      if (this.currentPageCategories > 1) this.currentPageCategories--;
      this.applyFilterAndPagination();
    } else {
      if (this.currentPageSuggested > 1) this.currentPageSuggested--;
      this.applySuggestedPagination();
    }
  }

  nextPage(): void {
    if (this.activeTab === 'categories') {
      if (
        this.currentPageCategories <
        Math.ceil(this.totalResultsCategories / this.itemsPerPageCategories)
      )
        this.currentPageCategories++;
      this.applyFilterAndPagination();
    } else {
      if (
        this.currentPageSuggested <
        Math.ceil(this.totalResultsSuggested / this.itemsPerPageSuggested)
      )
        this.currentPageSuggested++;
      this.applySuggestedPagination();
    }
  }

  // ---------- Helper Methods ----------
  getCurrentPage(): number {
    return this.activeTab === 'categories' ? this.currentPageCategories : this.currentPageSuggested;
  }

  getTotalPages(): number {
    if (this.activeTab === 'categories') {
      return Math.ceil(this.totalResultsCategories / this.itemsPerPageCategories);
    } else {
      return Math.ceil(this.totalResultsSuggested / this.itemsPerPageSuggested);
    }
  }

  isLastPage(): boolean {
    return this.getCurrentPage() === this.getTotalPages();
  }
}
