import {Component, inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ActivatedRoute, Router, RouterLink} from '@angular/router';
import {passwordMatchValidator} from '../validators/password-match.validator';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-admin-register',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, CommonModule],
  templateUrl: './admin-register.html',
  styleUrl: './admin-register.css',
})
export class AdminRegister implements OnInit {
  router = inject(Router);
  route = inject(ActivatedRoute);
  errorMessage: string | null = null;
  adminSecret: string | null = null;

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    login: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    repeatpassword: new FormControl('', [Validators.required]),
  }, {validators: passwordMatchValidator});

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.adminSecret = params.get('secret');
      if (!this.adminSecret) {
        this.router.navigate(['/register']);
      }
    });
  }

  async onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.errorMessage = null;

    const {name, login, password} = this.form.value;

    const response = await fetch(`/api/users/register/admin/${this.adminSecret}`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({name, login, password}),
    });

    if (response.ok) {
      alert('Rejestracja administratora pomyślna! Możesz się teraz zalogować.');
      this.router.navigate(['/login']);
    } else {
      const error = await response.text();
      this.errorMessage = error || 'Wystąpił błąd podczas rejestracji administratora.';
    }
  }
}

