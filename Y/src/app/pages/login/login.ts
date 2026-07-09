import {Component, inject, Input, signal, computed} from '@angular/core';
import { email, form, FormField, required, submit} from '@angular/forms/signals';
import { LoginInput } from '../../api/data-contracts';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Register } from '../register/register';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, FormField, Register],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login 
{
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = false;
  showRegisterForm = false;
  error = '';

  loginModel = signal<LoginInput>({
    email: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.email, {message: 'Email is required'});
    email(fieldPath.email, {message: 'Invalid email format'});
    required(fieldPath.password, {message: 'Password is required'});
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

    this.http.post<LoginInput>('http://localhost:5258/api/auth/login', this.loginModel())
    .subscribe({
      next: (response) => {
        console.log('Zalogowano', response);
        this.loading = false;
      },
      error: () => {
        this.error = 'Nieprawidłowy login lub hasło';
        this.loading = false;
      }
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
    // Add your login logic here
  });
}
}