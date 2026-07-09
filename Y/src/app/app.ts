import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Login } from "./pages/login/login";
import { Navigation } from "./pages/navigation/navigation";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, Navigation],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
    title = 'kanban-board-ui';
}
