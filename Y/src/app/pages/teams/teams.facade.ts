import { Injectable, computed, inject, signal } from '@angular/core';
import { Team, User } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';
import { TeamsService } from './teams.service';
import { UsersService } from './users.service';

@Injectable()
export class TeamsFacade {
  private readonly teamsService = inject(TeamsService);
  private readonly usersService = inject(UsersService);
  private readonly authService = inject(AuthService);

  readonly teams = signal<Team[]>([]);
  readonly users = signal<User[]>([]);
  readonly loading = signal(true);
  readonly creating = signal(false);
  readonly error = signal('');
  readonly createError = signal('');
  readonly removingMember = signal<string | null>(null);
  readonly memberError = signal('');
  readonly addingMember = signal<string | null>(null);
  readonly expandedTeams = signal<Set<string>>(new Set());
  readonly canManageMembers = computed(() => this.authService.isAdmin());

  load(): void {
    this.loadTeams();
    if (this.canManageMembers()) {
      this.loadUsers();
    }
  }

  createTeam(name: string): void {
    if (this.creating()) {
      return;
    }

    this.creating.set(true);
    this.createError.set('');
    this.teamsService.createTeam({ name }).subscribe({
      next: () => {
        this.creating.set(false);
        this.loadTeams();
      },
      error: () => {
        this.createError.set('Nie udało się utworzyć zespołu.');
        this.creating.set(false);
      },
    });
  }

  toggleTeam(teamId: string): void {
    const expandedTeams = new Set(this.expandedTeams());
    expandedTeams.has(teamId) ? expandedTeams.delete(teamId) : expandedTeams.add(teamId);
    this.expandedTeams.set(expandedTeams);
  }

  removeMember(teamId: string, userId: string): void {
    if (!this.canManageMembers() || this.removingMember()) {
      return;
    }

    this.removingMember.set(userId);
    this.memberError.set('');
    this.teamsService.removeMember(teamId, userId).subscribe({
      next: () => {
        this.removingMember.set(null);
        this.loadTeams();
      },
      error: () => {
        this.memberError.set('Nie udało się usunąć członka zespołu.');
        this.removingMember.set(null);
      },
    });
  }

  addMember(teamId: string, userId: string): void {
    if (!this.canManageMembers() || !userId || this.addingMember()) {
      return;
    }

    this.addingMember.set(teamId);
    this.memberError.set('');
    this.teamsService.addMember(teamId, userId).subscribe({
      next: () => {
        this.addingMember.set(null);
        this.loadTeams();
      },
      error: () => {
        this.memberError.set('Nie udało się dodać użytkownika do zespołu.');
        this.addingMember.set(null);
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

  private loadUsers(): void {
    this.usersService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.memberError.set('Nie udało się pobrać listy użytkowników.'),
    });
  }
}
