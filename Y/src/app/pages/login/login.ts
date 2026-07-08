import {Component, inject, Input, signal} from '@angular/core';
import {email, form, required} from '@angular/forms/signals';
import { LoginInput } from '../../api/data-contracts';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login 
{
  private fb = inject(FormBuilder);
  private http = inject(HttpClient);

  loading = false;
  error = '';

  loginModel = signal<LoginInput>({
    username: '',
    password: '',
  });

  loginForm = form(this.loginModel, (fieldPath) => {
    required(fieldPath.username, {message: 'Username is required'});
    required(fieldPath.password, {message: 'Password is required'});
  });

  login(): void {
    if (this.loginForm().invalid()) {
      this.loginForm().markAsTouched();
      return;
    }

    this.loading = true;
    this.error = '';

    this.http.post('https://localhost:5001/api/auth/login', {
      email: this.loginForm.username,
      password: this.loginForm.password
    })
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
}