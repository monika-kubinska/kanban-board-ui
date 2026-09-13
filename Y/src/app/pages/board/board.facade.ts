import { Injectable, computed, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, finalize, Observable, tap, throwError } from 'rxjs';
import { CreateItemInput, Item, ItemState, Team, TeamMember, UpdateItemInput } from '../../api/data-contracts';
import { TeamsService } from '../teams/teams.service';
import { ItemsService } from './items.service';

@Injectable()
export class BoardFacade {
  private readonly itemsService = inject(ItemsService);
  private readonly teamsService = inject(TeamsService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly teams = signal<Team[]>([]);
  readonly selectedTeamId = signal('');
  readonly items = signal<Item[]>([]);
  readonly loading = signal(true);
  readonly error = signal('');
  readonly updatingItemId = signal<string | null>(null);
  readonly assigningItemId = signal<string | null>(null);
  readonly creatingItem = signal(false);
  readonly backlogItems = computed(() => this.items().filter((item) => item.state === 'To Do'));
  readonly createItemError = signal('');
  readonly teamMembers = computed<TeamMember[]>(() => {
    const team = this.teams().find((candidate) => candidate.id === this.selectedTeamId());
    return team?.members ?? [];
  });
  readonly isBacklog = this.route.snapshot.data['view'] === 'backlog';
  readonly sprintColumns = computed(() => {
    const columns = new Map<string, Item[]>();
    for (const item of this.items()) {
      if (item.state !== 'To Do') {
        columns.set(item.state, [...(columns.get(item.state) ?? []), item]);
      }
    }
    return [...columns.entries()].map(([state, items]) => ({ state, items }));
  });

  constructor() {
    this.loadTeams();
  }

  selectTeam(teamId: string): void {
    if (!this.teams().some((team) => team.id === teamId)) {
      return;
    }

    this.selectedTeamId.set(teamId);
    this.loadItems(teamId);
    void this.router.navigate([this.isBacklog ? '/backlog' : '/boards', teamId]);
  }

  openBacklog(): void {
    if (this.selectedTeamId()) {
      void this.router.navigate(['/backlog', this.selectedTeamId()]);
    }
  }

  openSprintBoard(): void {
    if (this.selectedTeamId()) {
      void this.router.navigate(['/boards', this.selectedTeamId()]);
    }
  }

  changeState(itemId: string, state: ItemState): void {
    if (!state || this.updatingItemId()) {
      return;
    }

    const item = this.items().find((candidate) => candidate.id === itemId);
    if (item?.state === 'To Do' && state !== 'To Do' &&
      (item.estimation === undefined || item.estimation === null || !item.estimationUnit)) {
      this.error.set('Przed opuszczeniem To Do dodaj estymację i jednostkę.');
      return;
    }

    this.updatingItemId.set(itemId);
    this.itemsService.changeState(itemId, state).pipe(
      finalize(() => this.updatingItemId.set(null)),
    ).subscribe({
      next: () => this.loadItems(this.selectedTeamId()),
      error: () => this.error.set('Nie udało się zmienić stanu elementu.'),
    });
  }

  assignUser(itemId: string, userId: string): void {
    if (this.assigningItemId()) {
      return;
    }

    const previousAssigneeId = this.items().find((item) => item.id === itemId)?.assigneeId;
    const assigneeId = userId || undefined;
    this.assigningItemId.set(itemId);
    this.itemsService.assignUser(itemId, userId || null).pipe(
      finalize(() => this.assigningItemId.set(null)),
    ).subscribe({
      next: () => this.items.update((items) => items.map((item) => (
        item.id === itemId ? { ...item, assigneeId } : item
      ))),
      error: () => {
        this.items.update((items) => items.map((item) => (
          item.id === itemId ? { ...item, assigneeId: previousAssigneeId } : item
        )));
        this.error.set('Nie udało się przypisać użytkownika do elementu.');
      },
    });
  }

  updateItem(itemId: string, changes: Pick<UpdateItemInput, 'estimation' | 'estimationUnit'>): void {
    if (this.updatingItemId()) {
      return;
    }

    const item = this.items().find((candidate) => candidate.id === itemId);
    if (!item) {
      return;
    }

    this.updatingItemId.set(itemId);
    this.itemsService.updateItem(itemId, {
      team: this.selectedTeamId(),
      title: item.title,
      type: item.type,
      state: item.state,
      ...changes,
    }).pipe(
      finalize(() => this.updatingItemId.set(null)),
    ).subscribe({
      next: (updatedItem) => this.items.update((items) => items.map((current) => (
        current.id === itemId
          ? { ...current, ...updatedItem, assigneeId: updatedItem.assigneeId ?? updatedItem.assignedUserId }
          : current
      ))),
      error: () => this.error.set('Nie udało się zapisać estymacji elementu.'),
    });
  }

  createItem(item: CreateItemInput): Observable<void> {
    if (this.creatingItem()) {
      return throwError(() => new Error('Item creation already in progress'));
    }

    this.creatingItem.set(true);
    this.createItemError.set('');
    return this.itemsService.createItem(item).pipe(
      tap(() => this.loadItems(item.teamId)),
      catchError((error: unknown) => {
        this.createItemError.set('Nie udało się utworzyć elementu.');
        return throwError(() => error);
      }),
      finalize(() => this.creatingItem.set(false)),
    );
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
          this.loadItems(selectedTeamId);
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

  private loadItems(teamId: string): void {
    this.loading.set(true);
    this.error.set('');
    this.itemsService.getItems(teamId).subscribe({
      next: (items) => {
        this.items.set(items.map((item) => ({
          ...item,
          assigneeId: item.assigneeId ?? item.assignedUserId,
        })));
        this.loading.set(false);
      },
      error: () => {
        this.items.set([]);
        this.error.set('Nie udało się pobrać elementów zespołu.');
        this.loading.set(false);
      },
    });
  }
}