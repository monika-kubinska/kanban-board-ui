import { Component, computed, EventEmitter, inject, Output, signal } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { form, required, email, FormField } from '@angular/forms/signals';
import { Router } from '@angular/router';
import { RegisterInput } from '../../api/data-contracts';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  @Output() registerSuccess = new EventEmitter<void>();
  loading = false;
  error = '';

  registerModel = signal<RegisterInput>(
    {
      email: '',
      password: '',
      name: '',
    }
  );

  registerForm = form(this.registerModel, (fieldPath) => {
    required(fieldPath.email, { message: 'Pole e-mail jest wymagane' });
    email(fieldPath.email, { message: 'Nieprawidłowy format e-mail' });
    required(fieldPath.password, { message: 'Pole hasło jest wymagane' });
    required(fieldPath.name, { message: 'Pole imię jest wymagane' });
  });

  isFormValid = computed(() => !this.registerForm().invalid());

  register(event: SubmitEvent): void {
    event.preventDefault();
    console.log('Registering user with data:', this.registerModel());
    if (this.registerForm().invalid()) {
      this.registerForm().markAsTouched();
      console.log('Form is invalid. Marking fields as touched.');
      return;
    }

    this.loading = true;
    this.error = '';

    this.authService.register(this.registerModel())
      .subscribe({
        next: () => {
          console.log('Registration successful. Navigating to login page.');
          this.loading = false;
          this.registerSuccess.emit();
          void this.router.navigateByUrl('/login');
        },
        error: () => {
          console.error('Registration failed. Setting error message.');
          this.error = 'Nie udało się utworzyć konta';
          this.loading = false;
        }
      });
  }
}
