import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

export class Navigation {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly userName = this.authService.userName;
  readonly userEmail = this.authService.userEmail;

  logout(): void {
    this.authService.removeToken();
    void this.router.navigateByUrl('/login');
  }
}

