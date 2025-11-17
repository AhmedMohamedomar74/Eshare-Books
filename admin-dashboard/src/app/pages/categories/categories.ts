import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth';
import { CategoriesService } from '../../shared/services/categories';

interface Category {
  _id?: string;
  name: string;
  bookCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories implements OnInit {
  categories: Category[] = [];
  displayedCategories: Category[] = [];

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalResults: number = 0;

  loading = false;

  // Toast
  showToastMessage: boolean = false;
  toastMessage: string = '';
  toastType: 'success' | 'error' = 'success';

  // Add Modal
  showAddModal: boolean = false;
  newCategoryName: string = '';

  // Edit Modal
  showEditModal: boolean = false;
  editCategoryName: string = '';
  categoryToEdit: Category | null = null;

  // Delete Modal
  showDeleteModal: boolean = false;
  categoryToDelete: Category | null = null;

  constructor(private categoriesService: CategoriesService, private authService: AuthService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoriesService.getAllCategories().subscribe({
      next: async (res) => {
        const payload = res?.data ?? res;
        this.categories = Array.isArray(payload) ? payload : [];

        // Load actual book counts for each category
        await this.loadBooksCountForCategories();

        this.applyFilterAndPagination();
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
        this.showToast('Failed to load categories', 'error');
      },
    });
  }

  // New method to load actual book counts
  private async loadBooksCountForCategories(): Promise<void> {
    for (const category of this.categories) {
      if (category._id) {
        try {
          const booksResponse: any = await this.categoriesService
            .getBooksByCategory(category._id)
            .toPromise();
          category.bookCount = booksResponse?.books?.length || 0;
        } catch (error) {
          console.error(`Error loading books for category ${category.name}:`, error);
          category.bookCount = 0;
        }
      }
    }
  }

  applyFilterAndPagination(): void {
    const query = this.searchQuery.trim().toLowerCase();
    const filtered = query
      ? this.categories.filter((c) => (c.name ?? '').toLowerCase().includes(query))
      : [...this.categories];

    this.totalResults = filtered.length;
    const totalPages = Math.max(1, Math.ceil(this.totalResults / this.itemsPerPage));
    if (this.currentPage > totalPages) this.currentPage = totalPages;

    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.displayedCategories = filtered.slice(start, end);
  }

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
    this.applyFilterAndPagination();
  }

  // ---------- Toast ----------
  private showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 3000);
  }

  // ---------- Add ----------
  openAddCategoryModal(): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.newCategoryName = '';
    this.showAddModal = true;
  }

  confirmAddCategory(): void {
    const name = this.newCategoryName.trim();
    if (!name) return;

    this.categoriesService.createCategory({ name }).subscribe({
      next: (res) => {
        const newCat = res?.data ?? res;
        // Initialize with 0 books for new category
        this.categories.push({ bookCount: 0, ...newCat });
        this.applyFilterAndPagination();
        this.showAddModal = false;
        this.showToast('Category added successfully!', 'success');
      },
      error: () => this.showToast('Failed to add category', 'error'),
    });
  }

  // ---------- Edit ----------
  openEditModal(category: Category): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.categoryToEdit = category;
    this.editCategoryName = category.name;
    this.showEditModal = true;
  }

  confirmEditCategory(): void {
    if (!this.categoryToEdit) return;
    const name = this.editCategoryName.trim();
    if (!name) return;

    this.categoriesService.updateCategory(this.categoryToEdit._id!, { name }).subscribe({
      next: () => {
        this.categoryToEdit!.name = name;
        this.applyFilterAndPagination();
        this.showEditModal = false;
        this.showToast('Category updated successfully!', 'success');
      },
      error: () => this.showToast('Failed to update category', 'error'),
    });
  }

  // ---------- Delete ----------
  openDeleteModal(category: Category): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    this.categoryToDelete = category;
    this.showDeleteModal = true;
  }

  confirmDeleteCategory(): void {
    if (!this.categoryToDelete) return;

    this.categoriesService.deleteCategory(this.categoryToDelete._id!).subscribe({
      next: () => {
        this.categories = this.categories.filter((c) => c._id !== this.categoryToDelete!._id);
        this.applyFilterAndPagination();
        this.showDeleteModal = false;
        this.showToast('Category deleted successfully!', 'success');
      },
      error: () => this.showToast('Failed to delete category', 'error'),
    });
  }

  // ---------- Pagination ----------
  previousPage(): void {
    if (this.currentPage > 1) this.currentPage--;
    this.applyFilterAndPagination();
  }

  nextPage(): void {
    if (this.currentPage < Math.ceil(this.totalResults / this.itemsPerPage)) this.currentPage++;
    this.applyFilterAndPagination();
  }

  // ---------- Helper Methods for Template ----------
  getTotalPages(): number {
    return Math.ceil(this.totalResults / this.itemsPerPage);
  }

  isLastPage(): boolean {
    return this.currentPage === this.getTotalPages();
  }
}
