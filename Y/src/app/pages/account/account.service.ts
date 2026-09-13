import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { User } from '../../api/data-contracts';
import { AuthService } from '../../core/auth/auth.service';

@Injectable()
export class AccountService {
  private readonly http = inject(HttpClient);
  private readonly authService = inject(AuthService);

  getUsers(): Observable<User[]> {
    const token = this.authService.getToken();
    const headers = token
      ? new HttpHeaders({ Authorization: `Bearer ${token}` })
      : undefined;
    return this.http.get<User[]>(`${apiURL}/users`, { headers });
  }
}
