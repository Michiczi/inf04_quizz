import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface Question {
  question: string;
  answers: string[];
  correct: string;
}

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.html',
  styleUrl: './quiz.css',
})
export class Quiz implements OnInit {
  router = inject(Router);
  questionsList: Question[] = [];
  i = 0;
  goodAnwsers = 0;
  timer = 45;
  timerInterval: any;

  showResult = false;
  currentQuestion: Question | undefined;
  wynik = 0;
  isAnswered = false;

  answerStyles: { [key: string]: string } = {};

  highScore = 0;
  newHighScore = false;

  ngOnInit() {
    this.loadQuestions();
    this.loadHighScore();
  }

  async loadHighScore() {
    try {
      const response = await fetch('/api/users/highscore', {
        method: 'GET',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      });
      if (response.ok) {
        const data = await response.json();
        this.highScore = data.highscore || 0;
      }
    } catch (error) {
      console.error('Could not load highscore', error);
    }
  }

  async updateHighScore(score: number) {
    try {
      await fetch('/api/users/highscore', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ highscore: score }),
      });
    } catch (error) {
      console.error('Could not update highscore', error);
    }
  }

  async loadQuestions() {
    try {
      const response = await fetch(`/api/quizitems/pytania`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });
      if (response.ok) {
        this.questionsList = await response.json();
        this.startQuiz();
      } else {
        console.error('Failed to load questions');
        this.router.navigate(['/login']);
      }
    } catch (error) {
      console.error('Error fetching questions:', error);
      this.router.navigate(['/login']);
    }
  }

  startQuiz() {
    this.i = 0;
    this.goodAnwsers = 0;
    this.showResult = false;
    this.newHighScore = false;

    this.nextQuestion();
  }

  nextQuestion() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }

    if (this.i >= this.questionsList.length && this.questionsList.length > 0) {
      this.showResult = true;
      this.wynik = Math.round(100 * (this.goodAnwsers / this.questionsList.length));
      if (this.wynik > this.highScore) {
        this.newHighScore = true;
        this.highScore = this.wynik;
        this.updateHighScore(this.highScore);
      }
    } else {
      this.currentQuestion = this.questionsList[this.i];
      this.isAnswered = false;
      this.answerStyles = {};
      this.timer = 45;
      this.timerInterval = setInterval(() => this.timerFun(), 1000);
      this.i++;
    }
  }

  checkAnswer(selectedAnswer: string) {
    if (this.isAnswered) {
      return;
    }

    this.isAnswered = true;
    clearInterval(this.timerInterval);

    const correctAnwer = this.currentQuestion?.correct;

    if (selectedAnswer === correctAnwer) {
      this.answerStyles[selectedAnswer] = 'limegreen';
      this.goodAnwsers++;
    } else {
      this.answerStyles[selectedAnswer] = 'tomato';
      if (correctAnwer) {
        this.answerStyles[correctAnwer] = 'limegreen';
      }
    }
  }

  replay() {
    this.loadQuestions();
    this.startQuiz();
  }

  backToDashboard(): void {
    this.router.navigate(['/dashboard']);
  }

  timerFun() {
    this.timer--;
    if (this.timer <= 0) {
      this.nextQuestion();
    }
  }

  async logout() {
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

