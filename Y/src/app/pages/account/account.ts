import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';
import { Team } from '../../api/data-contracts';
import { TeamsService } from '../teams/teams.service';

@Component({
  selector: 'app-account',
  imports: [FormsModule],
  providers: [TeamsService],
  templateUrl: './account.html',
  styleUrl: './account.css',
})
export class Account {
  private readonly authService = inject(AuthService);
  private readonly teamsService = inject(TeamsService);

  readonly userName = this.authService.userName;
  readonly userEmail = this.authService.userEmail;
  readonly userRole = this.authService.userRole;
  readonly teams = signal<Team[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly creatingTeam = signal(false);
  readonly createTeamError = signal('');
  newTeamName = '';

  constructor() {
    this.loadTeams();
  }

  createTeam(event: SubmitEvent): void {
    event.preventDefault();
    const name = this.newTeamName.trim();

    if (!name || this.creatingTeam()) {
      return;
    }

    this.creatingTeam.set(true);
    this.createTeamError.set('');

    this.teamsService.createTeam({ name }).subscribe({
      next: () => {
        this.newTeamName = '';
        this.creatingTeam.set(false);
        this.loadTeams();
      },
      error: () => {
        this.createTeamError.set('Nie udało się utworzyć zespołu.');
        this.creatingTeam.set(false);
      },
    });
  }

  private loadTeams(): void {
    this.loading.set(true);
    this.teamsService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Nie udało się pobrać listy zespołów.');
        this.loading.set(false);
      },
    });
  }
}
