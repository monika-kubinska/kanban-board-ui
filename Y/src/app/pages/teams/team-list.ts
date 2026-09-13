import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Team, User } from '../../api/data-contracts';

@Component({
  selector: 'app-team-list',
  imports: [FormsModule],
  templateUrl: './team-list.html',
  styleUrl: './team-list.css',
})
export class TeamList {
  readonly teams = input<Team[]>([]);
  readonly users = input<User[]>([]);
  readonly canManageMembers = input(false);
  readonly loading = input(true);
  readonly error = input('');
  readonly expandedTeams = input<Set<string>>(new Set());
  readonly removingMember = input<string | null>(null);
  readonly addingMember = input<string | null>(null);
  readonly memberError = input('');
  readonly toggle = output<string>();
  readonly addMember = output<{ teamId: string; userId: string }>();
  readonly removeMember = output<{ teamId: string; userId: string }>();

  selectedUsers: Record<string, string> = {};

  isExpanded(teamId: string): boolean {
    return this.expandedTeams().has(teamId);
  }

  selectUser(teamId: string, userId: string): void {
    this.selectedUsers = { ...this.selectedUsers, [teamId]: userId };
  }

  submitAddMember(teamId: string): void {
    const userId = this.selectedUsers[teamId];
    if (userId && this.addingMember() !== teamId) {
      this.addMember.emit({ teamId, userId });
    }
  }

  isMember(team: Team, userId: string): boolean {
    return team.members?.some((member) => member.userId === userId) ?? false;
  }
}
