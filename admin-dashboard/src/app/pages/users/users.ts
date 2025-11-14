import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  isConfirmed: boolean;
  friends: number;
  profilePic: string;
}

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
  itemsPerPage: number = 5;
  totalResults: number = 2345;

  users: User[] = [
    {
      id: 'USR-001',
      firstName: 'Olivia',
      lastName: 'Martin',
      email: 'olivia.martin@example.com',
      role: 'Admin',
      isConfirmed: true,
      friends: 128,
      profilePic: 'https://i.pravatar.cc/150?img=1',
    },
    {
      id: 'USR-002',
      firstName: 'Liam',
      lastName: 'Garcia',
      email: 'liam.garcia@example.com',
      role: 'User',
      isConfirmed: true,
      friends: 75,
      profilePic: 'https://i.pravatar.cc/150?img=12',
    },
    {
      id: 'USR-003',
      firstName: 'Emma',
      lastName: 'Rodriguez',
      email: 'emma.rodriguez@example.com',
      role: 'User',
      isConfirmed: false,
      friends: 42,
      profilePic: 'https://i.pravatar.cc/150?img=5',
    },
    {
      id: 'USR-004',
      firstName: 'Noah',
      lastName: 'Smith',
      email: 'noah.smith@example.com',
      role: 'User',
      isConfirmed: true,
      friends: 91,
      profilePic: 'https://i.pravatar.cc/150?img=13',
    },
    {
      id: 'USR-005',
      firstName: 'Ava',
      lastName: 'Johnson',
      email: 'ava.johnson@example.com',
      role: 'User',
      isConfirmed: false,
      friends: 15,
      profilePic: 'https://i.pravatar.cc/150?img=9',
    },
  ];

  ngOnInit(): void {}

  get filteredUsers(): User[] {
    let filtered = [...this.users];

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      filtered = filtered.filter(
        (u) =>
          u.firstName.toLowerCase().includes(term) ||
          u.lastName.toLowerCase().includes(term) ||
          u.email.toLowerCase().includes(term) ||
          u.id.toLowerCase().includes(term)
      );
    }

    if (this.roleFilter !== 'all') {
      filtered = filtered.filter((u) => u.role.toLowerCase() === this.roleFilter.toLowerCase());
    }

    if (this.statusFilter !== 'all') {
      const isConfirmed = this.statusFilter === 'confirmed';
      filtered = filtered.filter((u) => u.isConfirmed === isConfirmed);
    }

    filtered.sort((a, b) => {
      switch (this.sortBy) {
        case 'name':
          return (a.firstName + ' ' + a.lastName).localeCompare(b.firstName + ' ' + b.lastName);
        case 'email':
          return a.email.localeCompare(b.email);
        case 'role':
          return a.role.localeCompare(b.role);
        case 'date':
          return b.id.localeCompare(a.id);
        default:
          return 0;
      }
    });

    this.totalResults = filtered.length;
    return filtered;
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredUsers.slice(start, end);
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

  addNewUser(): void {
    console.log('Add new user clicked');
  }

  editUser(user: User): void {
    console.log('Edit user:', user);
  }

  deleteUser(user: User): void {
    if (confirm(`Delete user ${user.firstName} ${user.lastName}?`)) {
      this.users = this.users.filter((u) => u.id !== user.id);
      if (this.paginatedUsers.length === 0 && this.currentPage > 1) {
        this.currentPage--;
      }
    }
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.currentPage = page;
    }
  }
}
