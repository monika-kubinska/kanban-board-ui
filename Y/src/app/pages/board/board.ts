import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Board as BoardData, Team } from '../../api/data-contracts';
import { TeamsService } from '../teams/teams.service';
import { BoardService } from './board.service';

@Component({
  selector: 'app-board',
  imports: [],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private readonly boardService = inject(BoardService);
  private readonly teamsService = inject(TeamsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly teams = signal<Team[]>([]);
  readonly selectedTeamId = signal('');
  readonly board = signal<BoardData | null>(null);
  readonly loading = signal(true);
  readonly error = signal('');

  constructor() {
    this.loadTeams();
  }

  selectTeam(teamId: string): void {
    if (!this.teams().some((team) => team.id === teamId)) {
      return;
    }

    this.selectedTeamId.set(teamId);
    this.loadBoard(teamId);
    void this.router.navigate(['/boards', teamId]);
  }

  private loadTeams(): void {
    this.teamsService.getTeams().subscribe({
      next: (teams) => {
        this.teams.set(teams);
        const routeTeamId = this.route.snapshot.paramMap.get('teamId');
        const selectedTeamId = routeTeamId && teams.some((team) => team.id === routeTeamId)
          ? routeTeamId
          : teams[0]?.id ?? '';

        this.selectedTeamId.set(selectedTeamId);
        if (selectedTeamId) {
          this.loadBoard(selectedTeamId);
        } else {
          this.loading.set(false);
        }
      },
      error: () => {
        this.error.set('Nie udało się pobrać listy zespołów.');
        this.loading.set(false);
      },
    });
  }

  private loadBoard(teamId: string): void {
    this.loading.set(true);
    this.error.set('');
    this.boardService.getBoard(teamId).subscribe({
      next: (board) => {
        this.board.set(board);
        this.loading.set(false);
      },
      error: () => {
        this.board.set(null);
        this.error.set('Nie udało się pobrać tablicy zespołu.');
        this.loading.set(false);
      },
    });
  }
}
