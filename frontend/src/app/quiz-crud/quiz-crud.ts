import {Component, inject, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {ChrPipe} from '../chr.pipe';


interface QuizItem {
  _id?: string;
  question: string;
  answers: string[];
  correct: string;
}

@Component({
  selector: 'app-quiz-crud',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChrPipe, RouterLink],
  templateUrl: './quiz-crud.html',
  styleUrl: './quiz-crud.css'
})
export class QuizCrud implements OnInit {
  router = inject(Router);
  fb = inject(FormBuilder);

  quizItems: QuizItem[] = [];
  paginatedQuizItems: QuizItem[] = [];
  quizForm: FormGroup;
  editingQuizItem: QuizItem | null = null;
  errorMessage: string | null = null;

  currentPage = 1;
  itemsPerPage = 10;
  totalPages = 1;

  constructor() {
    this.quizForm = this.fb.group({
      question: ['', [Validators.required, Validators.minLength(5)]],
      answers: this.fb.array([
        this.fb.control('', Validators.required),
        this.fb.control('', Validators.required)
      ], Validators.required),
      correct: ['', Validators.required],
    });
  }

  get answersFormArray(): FormArray<FormControl<string | null>> {
    return this.quizForm.get('answers') as FormArray<FormControl<string | null>>;
  }

  ngOnInit(): void {
    this.loadQuizItems();
  }

  addAnswer(): void {
    this.answersFormArray.push(this.fb.control('', Validators.required));
  }

  removeAnswer(index: number): void {
    if (this.answersFormArray.length <= 2) {
      this.errorMessage = 'Pytanie musi mieć co najmniej dwie odpowiedzi.';
      return;
    }

    const correctControl = this.quizForm.get('correct');
    if (!correctControl) return;

    const currentCorrect = correctControl.value;
    const correctIndex = currentCorrect.charCodeAt(0) - 97;

    this.answersFormArray.removeAt(index);

    if (index === correctIndex) {
      correctControl.setValue('a');
    } else if (index < correctIndex) {
      const newCorrect = String.fromCharCode(97 + (correctIndex - 1));
      correctControl.setValue(newCorrect);
    }
  }

  updatePaginatedItems(): void {
    this.totalPages = Math.ceil(this.quizItems.length / this.itemsPerPage);
    if (this.currentPage > this.totalPages) {
      this.currentPage = this.totalPages > 0 ? this.totalPages : 1;
    }
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedQuizItems = this.quizItems.slice(startIndex, endIndex);
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedItems();
    }
  }

  async loadQuizItems(): Promise<void> {
    try {
      const response = await fetch('/api/quizitems', {
        method: 'GET',
        credentials: 'include',
      });
      if (response.ok) {
        this.quizItems = await response.json();
        this.updatePaginatedItems();
      } else {
        const errorText = await response.text();
        this.errorMessage = `Failed to load quiz items: ${errorText}`;
        console.error('Failed to load quiz items:', response.status, errorText);
        this.router.navigate(['/admin-dashboard']);
      }
    } catch (error: any) {
      this.errorMessage = `Error fetching quiz items: ${error.message}`;
      console.error('Error fetching quiz items:', error);
      this.router.navigate(['/admin-dashboard']);
    }
  }

  async saveQuizItem(): Promise<void> {
    this.errorMessage = null;
    if (this.quizForm.invalid) {
      this.quizForm.markAllAsTouched();
      this.errorMessage = 'Proszę wypełnić wszystkie wymagane pola poprawnie.';
      return;
    }

    const formValue = this.quizForm.value;
    const answers: string[] = (formValue.answers || []).map((a: string | null) => a || '').filter((a: string) => a);

    if (answers.length < 2) {
      this.errorMessage = 'Pytanie musi mieć co najmniej dwie odpowiedzi.';
      return;
    }

    const correctIndex = (formValue.correct || 'a').charCodeAt(0) - 97;
    const correctText = answers[correctIndex];

    if (correctIndex < 0 || !correctText) {
      this.errorMessage = 'Wybrana poprawna odpowiedź jest nieprawidłowa.';
      return;
    }

    const quizItemToSend: Omit<QuizItem, '_id'> = {
      question: formValue.question,
      answers: answers,
      correct: correctText,
    };

    try {
      let response;
      if (this.editingQuizItem) {
        const body = {...quizItemToSend, _id: this.editingQuizItem._id};
        response = await fetch(`/api/quizitems/${this.editingQuizItem._id}`, {
          method: 'PUT',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify(body),
        });
      } else {
        response = await fetch('/api/quizitems', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          credentials: 'include',
          body: JSON.stringify(quizItemToSend),
        });
      }

      if (response.ok) {
        this.cancelEdit();
        await this.loadQuizItems();
      } else {
        const errorText = await response.text();
        this.errorMessage = `Failed to save quiz item: ${errorText}`;
        console.error('Failed to save quiz item:', response.status, errorText);
      }
    } catch (error: any) {
      this.errorMessage = `Error saving quiz item: ${error.message}`;
      console.error('Error saving quiz item:', error);
    }
  }

  editQuizItem(item: QuizItem): void {
    this.editingQuizItem = item;

    const answers = item.answers || (item as any).options;
    if (!answers || !Array.isArray(answers)) {
      this.errorMessage = 'Błąd: Ten element nie ma odpowiedzi do edycji.';
      return;
    }

    this.quizForm.patchValue({
      question: item.question,
    });
    this.answersFormArray.clear();
    answers.forEach((answer: string) => this.answersFormArray.push(this.fb.control(answer, Validators.required)));

    const correctStr = (item as any).correct || (item as any).correctAnswer;
    const correctOptionIndex = answers.findIndex((answer: string) => (answer ? answer.trim() : '') === (correctStr ? correctStr.trim() : ''));

    if (correctOptionIndex !== -1) {
      const correctOptionChar = String.fromCharCode(97 + correctOptionIndex);
      this.quizForm.patchValue({
        correct: correctOptionChar
      });
    }
  }

  cancelEdit(): void {
    this.editingQuizItem = null;
    this.quizForm.reset({
      question: '',
      correct: 'a'
    });
    this.answersFormArray.clear();
    this.addAnswer();
    this.addAnswer();
    this.errorMessage = null;
  }

  async deleteQuizItem(id: string | undefined): Promise<void> {
    if (!id) return;
    if (!confirm('Czy na pewno chcesz usunąć to pytanie?')) return;

    try {
      const response = await fetch(`/api/quizitems/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        await this.loadQuizItems();
      } else {
        const errorText = await response.text();
        this.errorMessage = `Failed to delete quiz item: ${errorText}`;
        console.error('Failed to delete quiz item:', response.status, errorText);
      }
    } catch (error: any) {
      this.errorMessage = `Error deleting quiz item: ${error.message}`;
      console.error('Error deleting quiz item:', error);
    }
  }
}

