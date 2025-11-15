// src/app/components/sidebar/sidebar.ts
import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../shared/services/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit, OnDestroy {
  user: any = {
    firstName: 'Guest',
    secondName: 'Admin',
    email: 'admin@esharebooks.com',
    profilePic: '/default-admin.png',
  };

  isLoggedIn = false;
  private authSubscription!: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // اشترك في isLoggedIn$ عشان يتحدث تلقائيًا
    this.authSubscription = this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;

      if (loggedIn) {
        this.loadUserProfile();
      } else {
        this.resetToGuest();
      }
    });
  }

  private loadUserProfile(): void {
    this.authService.getProfile().subscribe({
      next: (res) => {
        this.user = res.data || this.user;
      },
      error: (err) => {
        console.warn('Failed to load profile, using default.', err);
        this.resetToGuest();
      },
    });
  }

  private resetToGuest(): void {
    this.user = {
      firstName: 'Guest',
      secondName: 'Admin',
      email: 'admin@esharebooks.com',
      profilePic: '/default-admin.png',
    };
  }

  logout(): void {
    this.authService.logout();
  }

  ngOnDestroy(): void {
    if (this.authSubscription) {
      this.authSubscription.unsubscribe();
    }
  }
}
