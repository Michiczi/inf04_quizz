import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router, RouterLink} from '@angular/router';
import {passwordMatchValidator} from '../validators/password-match.validator';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  router = inject(Router);
  errorMessage: string | null = null;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    repeatpassword: new FormControl('', [Validators.required]),
  }, {validators: passwordMatchValidator});

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = null;

    const {name, login, password} = this.form.value;

    const response = await fetch('/api/users/register', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, login, password}),
    });

    if (response.ok) {
      alert('Rejestracja pomyślna! Możesz się teraz zalogować.');
      this.router.navigate(['/login']);
    } else {
      const error = await response.text();
      this.errorMessage = error || 'Wystąpił błąd podczas rejestracji.';
      alert(this.errorMessage);
    }
  }
}

