import { Component, inject, signal } from '@angular/core';
import { CreateItemInput, EstimationUnit, ItemState } from '../../api/data-contracts';
import { TranslationService } from '../../core/i18n/translation.service';
import { BoardFacade } from './board.facade';
import { CreateItemForm } from './create-item-form';
import { WorkItemCard } from './work-item-card';

@Component({
  selector: 'app-board',
  imports: [CreateItemForm, WorkItemCard],
  providers: [BoardFacade],
  templateUrl: './board.html',
  styleUrl: './board.css',
})
export class Board {
  private readonly facade = inject(BoardFacade);
  private readonly translationService = inject(TranslationService);
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);

  readonly teams = this.facade.teams;
  readonly selectedTeamId = this.facade.selectedTeamId;
  readonly loading = this.facade.loading;
  readonly error = this.facade.error;
  readonly updatingItemId = this.facade.updatingItemId;
  readonly assigningItemId = this.facade.assigningItemId;
  readonly creatingItem = this.facade.creatingItem;
  readonly backlogItems = this.facade.backlogItems;
  readonly createItemError = this.facade.createItemError;
  readonly isBacklog = this.facade.isBacklog;
  readonly sprintColumns = this.facade.sprintColumns;
  readonly teamMembers = this.facade.teamMembers;
  readonly createResetKey = signal(0);
  selectTeam(teamId: string): void {
    this.facade.selectTeam(teamId);
  }

  openBacklog(): void {
    this.facade.openBacklog();
  }

  openSprintBoard(): void {
    this.facade.openSprintBoard();
  }

  changeState(itemId: string, state: ItemState): void {
    this.facade.changeState(itemId, state);
  }

  assignUser(itemId: string, userId: string): void {
    this.facade.assignUser(itemId, userId);
  }

  updateEstimation(itemId: string, estimation: number | undefined, estimationUnit: EstimationUnit | undefined): void {
    this.facade.updateItem(itemId, { estimation, estimationUnit });
  }

  createItem(item: CreateItemInput): void {
    this.facade.createItem(item).subscribe({
      next: () => this.createResetKey.update((key) => key + 1),
      error: () => undefined,
    });
  }
}
