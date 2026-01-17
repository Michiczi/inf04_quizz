import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router, RouterLink} from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {
  router = inject(Router);
  adminName: string = 'Administratorze';

  ngOnInit(): void {
    this.loadAdminData();
  }

  async loadAdminData(): Promise<void> {
    try {
      const response = await fetch('/api/users/user', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        if (userData.role === 'admin') {
          this.adminName = userData.name || userData.login;
        } else {
          this.router.navigate(['/dashboard']);
        }
      } else {
        console.error('Failed to load admin data');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error fetching admin data:', error);
      this.router.navigate(['/login']);
    }
  }

  manageQuizQuestions(): void {
    this.router.navigate(['/admin/quiz-crud']);
  }

  async logout(): Promise<void> {
    try {
      const response = await fetch('/api/users/logout', {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        this.router.navigate(['/login']);
      } else {
        console.error('Logout failed on server, redirecting.');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error during logout:', error);
      this.router.navigate(['/login']);
    }
  }
}

