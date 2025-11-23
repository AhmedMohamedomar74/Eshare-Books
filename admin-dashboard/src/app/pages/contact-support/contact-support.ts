import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact-support',
  imports: [],
  templateUrl: './contact-support.html',
  styleUrl: './contact-support.css',
})
export class ContactSupport {
  constructor(private router: Router) {}

  goToLogin() {
    this.router.navigate(['/login']);
  }
}
