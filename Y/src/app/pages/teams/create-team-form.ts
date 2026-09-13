import { Component, inject, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '../../core/i18n/translation.service';

@Component({
  selector: 'app-create-team-form',
  imports: [FormsModule],
  templateUrl: './create-team-form.html',
  styleUrl: './create-team-form.css',
})
export class CreateTeamForm {
  private readonly translationService = inject(TranslationService);
  readonly t = (key: Parameters<TranslationService['translate']>[0]): string => this.translationService.translate(key);
  readonly loading = input(false);
  readonly error = input('');
  readonly create = output<string>();

  teamName = '';

  submit(event: SubmitEvent): void {
    event.preventDefault();
    const name = this.teamName.trim();

    if (!name || this.loading()) {
      return;
    }

    this.create.emit(name);
  }
}
