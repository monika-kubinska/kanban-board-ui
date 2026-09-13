import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { computed, inject } from '@angular/core';
import { AuthService } from '../../core/auth/auth.service';
import { Language, TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-navigation',
  imports: [RouterLink],
  templateUrl: './navigation.html',
  styleUrl: './navigation.css',
})

export class Navigation {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly translationService = inject(TranslationService);

  readonly isAuthenticated = computed(() => this.authService.isAuthenticated());
  readonly userName = this.authService.userName;
  readonly userEmail = this.authService.userEmail;
  readonly language = this.translationService.language;
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);

  setLanguage(event: Event): void {
    this.translationService.setLanguage((event.target as HTMLSelectElement).value as Language);
  }

  logout(): void {
    this.authService.removeToken();
    void this.router.navigateByUrl('/login');
  }
}

