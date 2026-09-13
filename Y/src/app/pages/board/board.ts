import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateItemInput } from '../../api/data-contracts';
import { BoardFacade } from './board.facade';

@Component({
  selector: 'app-board',
  imports: [FormsModule],
  providers: [BoardFacade],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private readonly facade = inject(BoardFacade);

  readonly teams = this.facade.teams;
  readonly selectedTeamId = this.facade.selectedTeamId;
  readonly items = this.facade.items;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly updatingItemId = this.facade.updatingItemId;
  readonly creatingItem = this.facade.creatingItem;
  readonly createItemError = this.facade.createItemError;
  readonly isBacklog = this.facade.isBacklog;
  readonly sprintColumns = this.facade.sprintColumns;
  itemTitle = '';
  itemType = '';
  itemEstimation: number | null = null;

  selectTeam(teamId: string): void {
    this.facade.selectTeam(teamId);
  }

  openBacklog(): void {
    this.facade.openBacklog();
  }

  openSprintBoard(): void {
    this.facade.openSprintBoard();
  }

  changeState(itemId: string, state: string): void {
    this.facade.changeState(itemId, state);
  }

  createItem(event: SubmitEvent): void {
    event.preventDefault();
    const title = this.itemTitle.trim();
    const teamId = this.selectedTeamId();

    if (!title || !teamId || this.creatingItem()) {
      return;
    }

    const item: CreateItemInput = {
      teamId,
      title,
      type: this.itemType.trim() || undefined,
      state: 'To Do',
      estimation: this.itemEstimation ?? undefined,
    };

    this.facade.createItem(item).subscribe({
      next: () => {
        this.itemTitle = '';
        this.itemType = '';
        this.itemEstimation = null;
      },
      error: () => undefined,
    });
  }
}
