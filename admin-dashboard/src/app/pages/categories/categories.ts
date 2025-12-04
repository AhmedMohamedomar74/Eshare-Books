import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth';
import { CategoriesService } from '../../shared/services/categories';
import { SuggestCategoryService } from '../../shared/services/suggest-category';

interface Category {
  _id?: string;
  name: string;
  isDeleted?: boolean;
  deletedAt?: string;
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
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  acceptedAt?: string;
  rejectedAt?: string;
  rejectionReason?: string;
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

  // Restore Modal
  showRestoreModal: boolean = false;
  categoryToRestore: Category | null = null;

  // Accept/Reject Modals
  showAcceptModal: boolean = false;
  suggestedCategoryToAccept: SuggestedCategory | null = null;

  showRejectModal: boolean = false;
  suggestedCategoryToReject: SuggestedCategory | null = null;
  rejectionReason: string = '';

  // Details Modal
  showDetailsModal: boolean = false;
  suggestedCategoryDetails: SuggestedCategory | null = null;

  // Filters
  selectedStatus = '';
  statusDropdownOpen = false;

  selectedSuggestedStatus = '';
  suggestedStatusDropdownOpen = false;

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
    this.selectedStatus = '';
    this.statusDropdownOpen = false;
    // تغيير القيمة الافتراضية إلى '' (All) بدلاً من 'pending'
    this.selectedSuggestedStatus = '';
    this.suggestedStatusDropdownOpen = false;
    this.applySuggestedPagination();
  }

  // ---------- Load Data ----------
  loadCategories(): void {
    this.loading = true;
    this.error = '';

    this.categoriesService.getAllCategoriesForAdmin().subscribe({
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

  // ---------- Filters ----------
  toggleStatusDropdown(): void {
    this.statusDropdownOpen = !this.statusDropdownOpen;
  }

  toggleSuggestedStatusDropdown(): void {
    this.suggestedStatusDropdownOpen = !this.suggestedStatusDropdownOpen;
  }

  closeStatusDropdown(): void {
    this.statusDropdownOpen = false;
  }

  closeSuggestedStatusDropdown(): void {
    this.suggestedStatusDropdownOpen = false;
  }

  onStatusFilter(status: string): void {
    this.selectedStatus = status;
    this.currentPageCategories = 1;
    this.closeStatusDropdown();
    this.applyFilterAndPagination();
  }

  onSuggestedStatusFilter(status: string): void {
    this.selectedSuggestedStatus = status;
    this.currentPageSuggested = 1;
    this.closeSuggestedStatusDropdown();
    this.applySuggestedPagination();
  }

  clearFilters(): void {
    this.searchQuery = '';
    this.selectedStatus = '';
    this.currentPageCategories = 1;
    this.closeStatusDropdown();
    this.applyFilterAndPagination();
  }

  clearSuggestedFilters(): void {
    this.selectedSuggestedStatus = '';
    this.currentPageSuggested = 1;
    this.closeSuggestedStatusDropdown();
    this.applySuggestedPagination();
  }

  getSelectedStatusName(): string {
    const map: any = {
      '': 'All Status',
      active: 'Active',
      deleted: 'Deleted',
    };
    return map[this.selectedStatus] || 'Status';
  }

  getSelectedSuggestedStatusName(): string {
    const map: any = {
      '': 'All',
      pending: 'Pending',
      accepted: 'Accepted',
      rejected: 'Rejected',
    };
    return map[this.selectedSuggestedStatus] || 'Status';
  }

  // ---------- Pagination & Filtering ----------
  applyFilterAndPagination(): void {
    let filtered = [...this.categories];

    // Apply search filter
    const query = this.searchQuery.trim().toLowerCase();
    if (query) {
      filtered = filtered.filter((c) => (c.name ?? '').toLowerCase().includes(query));
    }

    // Apply status filter
    if (this.selectedStatus) {
      if (this.selectedStatus === 'active') {
        filtered = filtered.filter((c) => !c.isDeleted);
      } else if (this.selectedStatus === 'deleted') {
        filtered = filtered.filter((c) => c.isDeleted);
      }
    }

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
    let filtered = [...this.suggestedCategories];

    // Apply status filter for suggested categories
    if (this.selectedSuggestedStatus) {
      filtered = filtered.filter((c) => c.status === this.selectedSuggestedStatus);
    }

    this.totalResultsSuggested = filtered.length;
    const totalPages = Math.max(
      1,
      Math.ceil(this.totalResultsSuggested / this.itemsPerPageSuggested)
    );
    if (this.currentPageSuggested > totalPages) this.currentPageSuggested = totalPages;

    const start = (this.currentPageSuggested - 1) * this.itemsPerPageSuggested;
    const end = start + this.itemsPerPageSuggested;
    this.displayedSuggestedCategories = filtered.slice(start, end);
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

  // ---------- Check if category exists (case-insensitive) ----------
  private checkCategoryExists(name: string, excludeCategory?: Category): boolean {
    const trimmedName = name.trim().toLowerCase();
    return this.categories.some((category) => {
      // If we're editing, exclude the current category from the check
      if (excludeCategory && category._id === excludeCategory._id) {
        return false;
      }
      // التحقق غير الحساس لحالة الأحرف
      return category.name.toLowerCase() === trimmedName;
    });
  }

  // ---------- Toast ----------
  showToast(message: string, type: 'success' | 'error' = 'success'): void {
    this.toastMessage = message;
    this.toastType = type;
    this.showToastMessage = true;
    setTimeout(() => (this.showToastMessage = false), 4000);
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
        // Handle specific error messages from backend - case-insensitive check
        if (err.error?.message?.includes('already exists but is deleted')) {
          this.addCategoryError =
            'Category already exists but is deleted. You can restore it from the deleted section.';
        } else if (
          err.status === 400 &&
          (err.error?.message?.includes('already exists') ||
            err.error?.message?.includes('Category already exists') ||
            err.error?.message?.includes('Category with this name'))
        ) {
          // تحسين رسالة الخطأ لتوضيح أنها case-insensitive
          this.addCategoryError = 'Category with this name already exists.';
        } else {
          this.showToast(err.error?.message || 'Failed to add category', 'error');
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
    if (category.isDeleted) {
      this.showToast('Cannot edit a deleted category', 'error');
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

    // Check if the name actually changed (case-insensitive)
    if (this.categoryToEdit.name.toLowerCase() === name.toLowerCase()) {
      this.showEditModal = false;
      return;
    }

    // Check if category with new name already exists (excluding current category) - case-insensitive
    if (this.checkCategoryExists(name, this.categoryToEdit)) {
      this.editCategoryError = 'Category with this name already exists (case-insensitive check)!';
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
        if (
          err.status === 400 &&
          (err.error?.message?.includes('already exists') ||
            err.error?.message?.includes('Category with this name'))
        ) {
          this.editCategoryError =
            'Category with this name already exists (case-insensitive check).';
          this.showToast('Category with this name already exists!', 'error');
        } else {
          this.showToast(err.error?.message || 'Failed to update category', 'error');
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
    if (category.isDeleted) {
      this.showToast('Category is already deleted', 'error');
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
        // Update the category locally to mark as deleted
        const categoryIndex = this.categories.findIndex(
          (c) => c._id === this.categoryToDelete!._id
        );
        if (categoryIndex !== -1) {
          this.categories[categoryIndex].isDeleted = true;
        }
        this.applyFilterAndPagination();
        this.showDeleteModal = false;
        this.modalLoading = false;
        this.showToast('Category deleted successfully!', 'success');
      },
      error: (err) => {
        this.modalLoading = false;
        if (err.error?.message?.includes('active books')) {
          this.showToast('Cannot delete category that contains active books', 'error');
        } else {
          this.showToast('Failed to delete category', 'error');
        }
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

  // ---------- Restore Category ----------
  openRestoreModal(category: Category): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    if (!category.isDeleted) {
      this.showToast('Category is not deleted', 'error');
      return;
    }
    this.categoryToRestore = category;
    this.showRestoreModal = true;
  }

  closeRestoreModal(): void {
    this.showRestoreModal = false;
    this.categoryToRestore = null;
  }

  confirmRestoreCategory(): void {
    if (!this.categoryToRestore) return;

    this.modalLoading = true;

    this.categoriesService.restoreCategory(this.categoryToRestore._id!).subscribe({
      next: () => {
        // Update the category locally to mark as restored
        const categoryIndex = this.categories.findIndex(
          (c) => c._id === this.categoryToRestore!._id
        );
        if (categoryIndex !== -1) {
          this.categories[categoryIndex].isDeleted = false;
          this.categories[categoryIndex].deletedAt = undefined;
        }
        this.applyFilterAndPagination();
        this.closeRestoreModal();
        this.modalLoading = false;
        this.showToast('Category restored successfully!', 'success');
      },
      error: (err) => {
        this.modalLoading = false;
        this.showToast(err.error?.message || 'Failed to restore category', 'error');
      },
    });
  }

  // ---------- Accept Suggested Category ----------
  openAcceptModal(category: SuggestedCategory): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    if (category.status !== 'pending') {
      this.showToast('This suggestion is already processed', 'error');
      return;
    }
    this.suggestedCategoryToAccept = category;
    this.showAcceptModal = true;
  }

  confirmAcceptCategory(): void {
    if (!this.suggestedCategoryToAccept) return;

    this.modalLoading = true;

    this.suggestCategoryService
      .acceptSuggestedCategory(this.suggestedCategoryToAccept._id!)
      .subscribe({
        next: (res) => {
          // Update the suggested category locally
          const categoryIndex = this.suggestedCategories.findIndex(
            (c) => c._id === this.suggestedCategoryToAccept!._id
          );
          if (categoryIndex !== -1) {
            this.suggestedCategories[categoryIndex].status = 'accepted';
            this.suggestedCategories[categoryIndex].acceptedAt = res.data?.suggestion?.acceptedAt;
            this.suggestedCategories[categoryIndex].isDeleted = true;
          }

          // Add the new category to the main categories list
          if (res.data?.category) {
            const newCategory = {
              _id: res.data.category.id,
              name: res.data.category.name,
              isDeleted: false,
            };
            this.categories.push(newCategory);
            this.applyFilterAndPagination();
          }

          this.applySuggestedPagination();
          this.showAcceptModal = false;
          this.modalLoading = false;
          this.showToast('Category suggestion accepted successfully!', 'success');
        },
        error: (err) => {
          this.modalLoading = false;
          this.showToast(err.error?.message || 'Failed to accept category suggestion', 'error');
        },
      });
  }

  // ---------- Reject Suggested Category ----------
  openRejectModal(category: SuggestedCategory): void {
    if (!this.authService.isAdmin()) {
      this.showToast('Unauthorized — Admin role required', 'error');
      return;
    }
    if (category.status !== 'pending') {
      this.showToast('This suggestion is already processed', 'error');
      return;
    }
    this.suggestedCategoryToReject = category;
    this.rejectionReason = '';
    this.showRejectModal = true;
  }

  confirmRejectCategory(): void {
    if (!this.suggestedCategoryToReject) return;

    this.modalLoading = true;

    const rejectionReason = this.rejectionReason.trim();

    this.suggestCategoryService
      .rejectSuggestedCategory(this.suggestedCategoryToReject._id!, rejectionReason || undefined)
      .subscribe({
        next: (res) => {
          // Update the suggested category locally
          const categoryIndex = this.suggestedCategories.findIndex(
            (c) => c._id === this.suggestedCategoryToReject!._id
          );
          if (categoryIndex !== -1) {
            this.suggestedCategories[categoryIndex].status = 'rejected';
            this.suggestedCategories[categoryIndex].rejectedAt = res.data?.rejectedAt;
            this.suggestedCategories[categoryIndex].rejectionReason = res.data?.rejectionReason;
            this.suggestedCategories[categoryIndex].isDeleted = true;
          }

          this.applySuggestedPagination();
          this.showRejectModal = false;
          this.modalLoading = false;
          this.showToast('Category suggestion rejected successfully!', 'success');
        },
        error: (err) => {
          this.modalLoading = false;
          this.showToast(err.error?.message || 'Failed to reject category suggestion', 'error');
        },
      });
  }

  // ---------- View Details ----------
  openDetailsModal(category: SuggestedCategory): void {
    this.suggestedCategoryDetails = category;
    this.showDetailsModal = true;
  }

  closeDetailsModal(): void {
    this.showDetailsModal = false;
    this.suggestedCategoryDetails = null;
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

  // Helper to get status badge class
  getStatusBadgeClass(category: Category): string {
    if (category.isDeleted) {
      return 'bg-secondary-light text-secondary';
    }
    return 'bg-success-light text-success';
  }

  getSuggestedStatusBadgeClass(category: SuggestedCategory): string {
    switch (category.status) {
      case 'pending':
        return 'bg-warning-light text-warning';
      case 'accepted':
        return 'bg-success-light text-success';
      case 'rejected':
        return 'bg-danger-light text-danger';
      default:
        return 'bg-secondary-light text-secondary';
    }
  }

  getStatusText(category: Category): string {
    return category.isDeleted ? 'Deleted' : 'Active';
  }

  getSuggestedStatusText(category: SuggestedCategory): string {
    return category.status.charAt(0).toUpperCase() + category.status.slice(1);
  }

  // Format date for display
  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return 'Invalid Date';
    }
  }

  // Safe getter for full name
  getFullName(category: SuggestedCategory): string {
    return category.suggestedBy?.fullName || 'Unknown';
  }

  // Safe getter for category name
  getCategoryName(category: Category | null): string {
    return category?.name || '';
  }

  // Safe getter for suggested category name
  getSuggestedCategoryName(category: SuggestedCategory | null): string {
    return category?.name || '';
  }

  // Safe getter for suggested by name
  getSuggestedByName(category: SuggestedCategory | null): string {
    return category?.suggestedBy?.fullName || 'Unknown';
  }

  // Safe getter for creation date
  getCreationDate(category: SuggestedCategory | null): string {
    return category?.createdAt ? this.formatDate(category.createdAt) : 'N/A';
  }

  // Safe getter for accepted date
  getAcceptedDate(category: SuggestedCategory | null): string {
    return category?.acceptedAt ? this.formatDate(category.acceptedAt) : 'N/A';
  }

  // Safe getter for rejected date
  getRejectedDate(category: SuggestedCategory | null): string {
    return category?.rejectedAt ? this.formatDate(category.rejectedAt) : 'N/A';
  }
}
