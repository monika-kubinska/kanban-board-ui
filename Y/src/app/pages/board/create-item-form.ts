import { Component, effect, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CreateItemInput, EstimationUnit, ItemType } from '../../api/data-contracts';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-create-item-form',
  imports: [FormsModule],
  templateUrl: './create-item-form.html',
  styleUrl: './create-item-form.css',
})
export class CreateItemForm {
  private readonly translationService = inject(TranslationService);
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);
  readonly teamId = input.required<string>();
  readonly loading = input(false);
  readonly error = input('');
  readonly resetKey = input(0);
  readonly create = output<CreateItemInput>();
  readonly itemTypes: ItemType[] = ['Epic', 'Story', 'Defect'];

  itemTitle = '';
  itemType: ItemType | '' = '';
  itemEstimation: number | null = null;
  itemEstimationUnit: EstimationUnit = 'hours';

  constructor() {
    effect(() => {
      this.resetKey();
      this.reset();
    });
  }

  submit(event: SubmitEvent): void {
    event.preventDefault();
    const title = this.itemTitle.trim();

    if (!title || !this.itemType || this.loading()) {
      return;
    }

    this.create.emit({
      teamId: this.teamId(),
      title,
      type: this.itemType,
      state: 'To Do',
      estimation: this.itemEstimation ?? undefined,
      estimationUnit: this.itemEstimationUnit,
    });
  }

  reset(): void {
    this.itemTitle = '';
    this.itemType = '';
    this.itemEstimation = null;
    this.itemEstimationUnit = 'hours';
  }
}
