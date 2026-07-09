import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Login } from "./pages/login/login";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Login],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
    title = 'kanban-board-ui';
}
