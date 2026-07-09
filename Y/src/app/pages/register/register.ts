import { HttpClient } from '@angular/common/http';
import { Component, computed, EventEmitter, inject, Input, Output, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { form, required, email, submit, FormField } from '@angular/forms/signals';
import { RegisterInput } from '../../api/data-contracts';
import { CommonModule } from '@angular/common';
import { apiURL } from '../../api/config';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, FormField],
  templateUrl: './register.html',
  styleUrl: './register.css',
})
export class Register {
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

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

  register(): void {
    console.log('register form submitted:', this.registerForm());
    if (this.registerForm().invalid()) {
      this.registerForm().markAsTouched();
      return;
    }

    console.log('register form is valid. Proceeding with register...');

    this.loading = true;
    this.error = '';

    this.http.post<RegisterInput>(`${apiURL}/auth/register`, this.registerModel())
      .subscribe({
        next: (response) => {
          console.log('Zarejestrowano', response);
          this.loading = false;
          this.registerSuccess.emit();},
        error: () => {
          this.error = 'Nieprawidłowy register lub hasło';
          this.loading = false;
        }
      });
  }

  onSubmit(event: Event) {
    console.log('Form submitted:', this.registerForm());

    event.preventDefault();
    submit(this.registerForm, async () => {
      const credentials = this.registerModel();
      console.log('Logging in with:', credentials);
      // Add your register logic here
    });
  }
}
