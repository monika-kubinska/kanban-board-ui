import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-team-form',
  imports: [FormsModule],
  templateUrl: './create-team-form.html',
  styleUrl: './create-team-form.css',
})
export class CreateTeamForm {
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
