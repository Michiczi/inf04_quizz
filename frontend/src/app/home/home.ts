import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {Router} from "@angular/router";

interface Feature {
  icon: string;
  emoji: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, NgbModule],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home {
  currentYear = new Date().getFullYear();

  heroImage = 'https://images.unsplash.com/photo-1617507171089-6cb9aa5add36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxuZW9uJTIwZ2FtaW5nJTIwc2V0dXB8ZW58MXx8fHwxNzYzODEzMDYyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral';

  stats = [
    {value: '250+', label: 'Pytań', emoji: '📝'},
    {value: '15 min', label: 'Czas trwania', emoji: '⏰'},
  ];

  features: Feature[] = [
    {
      icon: '🔐',
      emoji: '🔑',
      title: 'Bezpieczne Konta Użytkowników',
      description: 'Łatwa i bezpieczna rejestracja oraz logowanie. Twoje konto jest u nas bezpieczne!',
      color: '#00ffff'
    },
    {
      icon: '🏆',
      emoji: '📈',
      title: 'Wyniki i Rekordy',
      description: 'Śledź swoje wyniki w quizach, bij rekordy i sprawdzaj, jak sobie radzisz.',
      color: '#ff00ff'
    },
    {
      icon: '📝',
      emoji: '🛠️',
      title: 'Zarządzanie Quizami (CRUD)',
      description: 'Intuicyjny interfejs dla administratorów do tworzenia, edytowania i usuwania pytań',
      color: '#ffff00'
    },
    {
      icon: '🎮',
      emoji: '✨',
      title: 'Interaktywny Quiz',
      description: 'Weź udział w angażującym quizie, odpowiadaj na pytania i sprawdź swoją wiedzę.',
      color: '#00ff00'
    },
    {
      icon: '📊',
      emoji: '📈',
      title: 'Estetyczny interfejs',
      description: 'Nowoczesny i intuicyjny interfejs użytkownika, stworzony przy użyciu Angulara i Bootstrapa, zapewnia płynne i przyjemne doświadczenie.',
      color: '#ff6600'
    },
    {
      icon: '🛡️',
      emoji: '🔒',
      title: 'Walidacja i Bezpieczeństwo',
      description: 'Wbudowane mechanizmy ochrony (AuthGuard) i walidacji haseł zapewniają bezpieczeństwo konta.',
      color: '#ff0080'
    }
  ];

  constructor(private readonly router: Router) {
  }

  onGetStarted(): void {
    console.log('Zaczynamy! Startujemy quiz! 🚀');
    this.router.navigate(['/quiz']);
  }
}
