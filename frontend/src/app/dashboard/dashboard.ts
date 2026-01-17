import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {
  router = inject(Router);
  userName: string = 'Użytkowniku';
  highScore: number = 0;

  ngOnInit(): void {
    this.loadUserData();
  }

  async loadUserData(): Promise<void> {
    try {
      const response = await fetch('/api/users/user', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        const userData = await response.json();
        this.userName = userData.name || userData.login;
        this.highScore = userData.bestScore || 0;
      } else {
        console.error('Failed to load user data');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      this.router.navigate(['/login']);
    }
  }

  startQuiz(): void {
    this.router.navigate(['/quiz']);
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
