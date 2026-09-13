import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { CreateTeamInput, Team } from '../../api/data-contracts';

@Injectable({ providedIn: 'root' })
export class TeamsService {
  private readonly http = inject(HttpClient);

  getTeams(): Observable<Team[]> {
    return this.http.get<Team[]>(`${apiURL}/teams`);
  }

  createTeam(team: CreateTeamInput): Observable<void> {
    return this.http
      .post(`${apiURL}/teams`, team, {
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  removeMember(teamId: string, userId: string): Observable<void> {
    return this.http
      .delete(`${apiURL}/teams/${teamId}/members/${userId}`, {
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

  addMember(teamId: string, userId: string): Observable<void> {
    return this.http
      .post(`${apiURL}/teams/${teamId}/members`, { userId }, {
        responseType: 'text',
      })
      .pipe(map(() => undefined));
  }

}
