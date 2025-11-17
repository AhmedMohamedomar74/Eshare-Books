import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService, UserProfile } from '../../shared/services/auth';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  user: UserProfile | null = null;
  isLoggedIn = false;
  isLoading = true;
  showLogoutModal = false;

  private authSubscription?: Subscription;
  private userSubscription?: Subscription;

  // Default guest user
  private readonly guestUser = {
    _id: '',
    firstName: 'Guest',
    secondName: 'Admin',
    email: 'admin@esharebooks.com',
    role: 'admin' as const,
    isConfirmed: false,
    profilePic: '/default-admin.png',
    createdAt: '',
    updatedAt: '',
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Subscribe to login state
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
      this.isLoading = false;

      if (!loggedIn) {
        this.user = null;
      } else {
        // If logged in but user not loaded, try to load profile
        if (!this.user) {
          this.loadUserProfile();
        }
      }
    });

    // Subscribe to user profile changes
    this.userSubscription = this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });

    // Initial load check
    if (this.authService.isLoggedIn() && !this.user) {
      this.loadUserProfile();
    } else {
      this.isLoading = false;
    }
  }

  private loadUserProfile(): void {
    this.isLoading = true;
    this.authService.loadUserProfile().subscribe({
      next: (profile) => {
        this.user = profile;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load user profile in sidebar:', err);
        this.isLoading = false;
        // If profile loading fails, the service will handle logout if needed
      },
    });
  }

  get displayUser(): UserProfile {
    return this.user || this.guestUser;
  }

  get userFullName(): string {
    if (this.isLoading) return 'Loading...';
    if (!this.user) return 'Guest Admin';
    return `${this.user.firstName} ${this.user.secondName}`;
  }

  get userAvatar(): string {
    return this.user?.profilePic || this.guestUser.profilePic;
  }

  openLogoutModal(): void {
    this.showLogoutModal = true;
  }

  closeLogoutModal(): void {
    this.showLogoutModal = false;
  }

  confirmLogout(): void {
    this.authService.logout();
    this.closeLogoutModal();
  }

  ngOnDestroy(): void {
    this.authSubscription?.unsubscribe();
    this.userSubscription?.unsubscribe();
  }
}
