import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { CreateTeamInput, Team, User } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class TeamsService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${apiURL}/teams`, {
      headers: this.authHeaders(),
    });
  }

  createTeam(team: CreateTeamInput): Observable<void> {
    return this.http
      .post(`${apiURL}/teams`, team, {
        headers: this.authHeaders(),
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  removeMember(teamId: string, userId: string): Observable<void> {
    return this.http
      .delete(`${apiURL}/teams/${teamId}/members/${userId}`, {
        headers: this.authHeaders(),
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  addMember(teamId: string, userId: string): Observable<void> {
    return this.http
      .post(`${apiURL}/teams/${teamId}/members`, { userId }, {
        headers: this.authHeaders(),
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${apiURL}/teams/users`, {
      headers: this.authHeaders(),
    });
  }

  private authHeaders(): HttpHeaders | undefined {
    const token = this.authService.getToken();
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : undefined;
  }
}
