import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

interface Category {
  id: string;
  name: string;
  bookCount: number;
}

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories.html',
  styleUrls: ['./categories.css'],
})
export class Categories {
  categories: Category[] = [
    { id: 'CAT-001', name: 'Science Fiction', bookCount: 125 },
    { id: 'CAT-002', name: 'History', bookCount: 88 },
    { id: 'CAT-003', name: 'Business & Finance', bookCount: 210 },
    { id: 'CAT-004', name: "Children's Literature", bookCount: 95 },
    { id: 'CAT-005', name: 'Fantasy', bookCount: 150 },
  ];

  searchQuery: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 5;
  totalResults: number = 50;

  onSearch(event: any): void {
    this.searchQuery = event.target.value;
    this.currentPage = 1;
  }

  addCategory(): void {
    console.log('Add new category');
  }

  editCategory(category: Category): void {
    console.log('Edit category:', category);
  }

  deleteCategory(category: Category): void {
    console.log('Delete category:', category);
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  nextPage(): void {
    const totalPages = Math.ceil(this.totalResults / this.itemsPerPage);
    if (this.currentPage < totalPages) {
      this.currentPage++;
    }
  }
}
