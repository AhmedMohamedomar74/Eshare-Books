import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface StatCard {
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: string;
  iconColor: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
})
export class Dashboard implements OnInit {
  stats: StatCard[] = [
    {
      label: 'Total Books',
      value: '12,450',
      change: '+2.5% this week',
      isPositive: true,
      icon: 'bi bi-book',
      iconColor: 'blue',
    },
    {
      label: 'Total Users',
      value: '8,321',
      change: '+1.8% this week',
      isPositive: true,
      icon: 'bi bi-people',
      iconColor: 'blue',
    },
    {
      label: 'Total Categories',
      value: '24',
      change: '+2 this week',
      isPositive: true,
      icon: 'bi bi-tags',
      iconColor: 'blue',
    },
    {
      label: 'Pending Reports',
      value: '15',
      change: '+3 this week',
      isPositive: false,
      icon: 'bi bi-file-earmark-text',
      iconColor: 'blue',
    },
  ];

  constructor() {}

  ngOnInit(): void {
    // Load stats data if needed from API
  }
}
