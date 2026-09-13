import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { Team } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getTeams(): Observable<Team[]> {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;

    return this.http.get<Team[]>(`${apiURL}/teams`, { headers });
  }
}
