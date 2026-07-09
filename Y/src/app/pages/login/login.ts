import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required, submit } from '@angular/forms/signals';
import { LoginInput } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';
import { Register } from '../register/register';
import { apiURL } from '../../api/config';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormField, Register],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);
  private authService = inject(AuthService);

  loading = false;
  showRegisterForm = false;
  error = '';

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly authStatusMessage = computed(() =>
    this.isAuthenticated() ? 'Jesteś zalogowany' : 'Nie jesteś zalogowany'
  );

  loginModel = signal<LoginInput>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Pole e-mail jest wymagane' });
    email(fieldPath.email, { message: 'Nieprawidłowy format e-mail' });
    required(fieldPath.password, { message: 'Pole hasło jest wymagane' });
  });

  isFormValid = computed(() => !this.loginForm().invalid());

  login(): void {
    console.log('Login form submitted:', this.loginForm());
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    console.log('Login form is valid. Proceeding with login...');

    this.loading = true;
    this.error = '';

    this.http
      .post<{ token?: string; accessToken?: string }>(`${apiURL}/auth/login`, this.loginModel())
      .subscribe({
        next: (response) => {
          const token = response.token ?? response.accessToken ?? null;
          this.authService.setToken(token);
          console.log('Zalogowano', response);
          this.loading = false;
        },
        error: () => {
          this.authService.removeToken();
          this.error = 'Nieprawidłowy login lub hasło';
          this.loading = false;
        },
      });
  }

  onRegisterClick() {
    this.showRegisterForm = true;
  }

  onSubmit(event: Event) {
    console.log('Form submitted:', this.loginForm());

    event.preventDefault();
    submit(this.loginForm, async () => {
      const credentials = this.loginModel();
      console.log('Logging in with:', credentials);
    });
  }
}
