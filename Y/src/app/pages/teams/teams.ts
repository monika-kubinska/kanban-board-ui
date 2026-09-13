import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Team, User } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';
import { TeamsService } from './teams.service';

@Component({
  selector: 'app-teams',
  imports: [FormsModule],
  providers: [TeamsService],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  private readonly teamsService = inject(TeamsService);
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
  readonly selectedUsers = signal<Record<string, string>>({});
  readonly canManageMembers = computed(() => this.authService.userRole() === 'Admin');
  readonly expandedTeams = signal<Set<string>>(new Set());
  newTeamName = '';

  constructor() {
    this.loadTeams();
    if (this.canManageMembers()) {
      this.loadUsers();
    }
  }

  createTeam(event: SubmitEvent): void {
    event.preventDefault();
    const name = this.newTeamName.trim();

    if (!name || this.creating()) {
      return;
    }

    this.creating.set(true);
    this.createError.set('');

    this.teamsService.createTeam({ name }).subscribe({
      next: () => {
        this.newTeamName = '';
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
    if (expandedTeams.has(teamId)) {
      expandedTeams.delete(teamId);
    } else {
      expandedTeams.add(teamId);
    }
    this.expandedTeams.set(expandedTeams);
  }

  isExpanded(teamId: string): boolean {
    return this.expandedTeams().has(teamId);
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

  selectUser(teamId: string, userId: string): void {
    this.selectedUsers.update((selectedUsers) => ({ ...selectedUsers, [teamId]: userId }));
  }

  addMember(teamId: string): void {
    const userId = this.selectedUsers()[teamId];
    if (!this.canManageMembers() || !userId || this.addingMember()) {
      return;
    }

    this.addingMember.set(teamId);
    this.memberError.set('');

    this.teamsService.addMember(teamId, userId).subscribe({
      next: () => {
        this.addingMember.set(null);
        this.selectUser(teamId, '');
        this.loadTeams();
      },
      error: () => {
        this.memberError.set('Nie udało się dodać użytkownika do zespołu.');
        this.addingMember.set(null);
      },
    });
  }

  isMember(team: Team, userId: string): boolean {
    return team.members?.some((member) => member.userId === userId) ?? false;
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
    this.teamsService.getUsers().subscribe({
      next: (users) => this.users.set(users),
      error: () => this.memberError.set('Nie udało się pobrać listy użytkowników.'),
    });
  }
}
