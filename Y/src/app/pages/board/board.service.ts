import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { Board } from '../../api/data-contracts';

@Injectable({ providedIn: 'root' })
export class BoardService {
  private readonly http = inject(HttpClient);

  getBoard(teamId: string): Observable<Board> {
    return this.http.get<Board>(`${apiURL}/boards/${teamId}`);
  }
}