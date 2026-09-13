import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { email, form, FormField, required } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { LoginInput } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';
import { TranslationService } from '../../core/i18n/translation.service';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormField, Register],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);

  loading = false;
  showRegisterForm = false;
  error = '';

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly authStatusMessage = computed(() =>
    this.isAuthenticated() ? this.t('loginStatus') : this.t('logoutStatus')
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

  login(event: SubmitEvent): void {
    event.preventDefault();
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService
      .login(this.loginModel())
      .subscribe({
        next: () => {
          this.loading = false;
          void this.router.navigateByUrl('/');
        },
        error: () => {
          this.error = 'Nieprawidłowy login lub hasło';
          this.loading = false;
        },
      });
  }

  onRegisterClick() {
    this.showRegisterForm = true;
  }

}
