import { Component, inject } from '@angular/core';
import { CreateTeamForm } from './create-team-form';
import { TeamList } from './team-list';
import { TeamsFacade } from './teams.facade';

@Component({
  selector: 'app-teams',
  imports: [CreateTeamForm, TeamList],
  providers: [TeamsFacade],
  templateUrl: './teams.html',
  styleUrl: './teams.css',
})
export class Teams {
  private readonly facade = inject(TeamsFacade);

  readonly teams = this.facade.teams;
  readonly users = this.facade.users;
  readonly loading = this.facade.loading;
  readonly creating = this.facade.creating;
  readonly error = this.facade.error;
  readonly createError = this.facade.createError;
  readonly removingMember = this.facade.removingMember;
  readonly memberError = this.facade.memberError;
  readonly addingMember = this.facade.addingMember;
  readonly canManageMembers = this.facade.canManageMembers;
  readonly expandedTeams = this.facade.expandedTeams;

  constructor() {
    this.facade.load();
  }

  createTeam(name: string): void {
    this.facade.createTeam(name);
  }

  toggleTeam(teamId: string): void {
    this.facade.toggleTeam(teamId);
  }

  removeMember(event: { teamId: string; userId: string }): void {
    this.facade.removeMember(event.teamId, event.userId);
  }

  addMember(event: { teamId: string; userId: string }): void {
    this.facade.addMember(event.teamId, event.userId);
  }
}
