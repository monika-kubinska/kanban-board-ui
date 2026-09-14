import { Component, computed, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EstimationUnit, Item, ItemState, TeamMember } from '../../api/data-contracts';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-work-item-card',
  imports: [FormsModule],
  templateUrl: './work-item-card.html',
  styleUrl: './work-item-card.css',
})
export class WorkItemCard {
  private readonly translationService = inject(TranslationService);
  readonly item = input.required<Item>();
  readonly members = input<TeamMember[]>([]);
  readonly updating = input(false);
  readonly assigning = input(false);
  readonly showState = input(false);
  readonly estimationUnitLabel: Record<EstimationUnit, string> = {
    hours: 'h',
    points: 'pkt',
  };
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);
  readonly assigneeOptions = computed(() => {
    const currentAssigneeId = this.item().assigneeId;
    const members = this.members();

    if (!currentAssigneeId || members.some((member) => member.userId === currentAssigneeId)) {
      return members;
    }

    return [...members, { userId: currentAssigneeId, name: `Użytkownik (${currentAssigneeId})` }];
  });
  readonly stateChange = output<ItemState>();
  readonly assigneeChange = output<string>();
  readonly estimationChange = output<{ estimation: number | undefined; estimationUnit: EstimationUnit | undefined }>();
  editingEstimation = false;
  estimationDraft: number | null = null;
  estimationUnitDraft: EstimationUnit = 'hours';

  readonly states: ItemState[] = [
    'To Do',
    'Ready',
    'In Progress',
    'Code Review',
    'In Test',
    'Ready for Production',
    'Done',
  ];

  changeState(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.stateChange.emit(select.value as ItemState);
  }

  assignUser(event: Event): void {
    this.assigneeChange.emit((event.target as HTMLSelectElement).value);
  }

  startEstimationEdit(): void {
    this.estimationDraft = this.item().estimation ?? null;
    this.estimationUnitDraft = this.item().estimationUnit ?? 'hours';
    this.editingEstimation = true;
  }

  saveEstimation(event: SubmitEvent): void {
    event.preventDefault();
    if (this.estimationDraft !== null && (!Number.isFinite(this.estimationDraft) || this.estimationDraft < 0)) {
      return;
    }

    this.estimationChange.emit({
      estimation: this.estimationDraft ?? undefined,
      estimationUnit: this.estimationDraft === null ? undefined : this.estimationUnitDraft,
    });
    this.editingEstimation = false;
  }

  cancelEstimationEdit(): void {
    this.editingEstimation = false;
  }
}
