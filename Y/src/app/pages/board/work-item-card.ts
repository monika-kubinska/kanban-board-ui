import { Component, computed, input, output } from '@angular/core';
import { EstimationUnit, Item, ItemState, TeamMember } from '../../api/data-contracts';

@Component({
  selector: 'app-work-item-card',
  templateUrl: './work-item-card.html',
  styleUrl: './work-item-card.css',
})
export class WorkItemCard {
  readonly item = input.required<Item>();
  readonly members = input<TeamMember[]>([]);
  readonly updating = input(false);
  readonly assigning = input(false);
  readonly showState = input(false);
  readonly estimationUnitLabel: Record<EstimationUnit, string> = {
    hours: 'h',
    points: 'pkt',
  };
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
    this.stateChange.emit((event.target as HTMLSelectElement).value as ItemState);
  }

  assignUser(event: Event): void {
    this.assigneeChange.emit((event.target as HTMLSelectElement).value);
  }
}
