import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { LoginInput, RegisterInput } from '../../api/data-contracts';

export interface LoginResponse {
  token?: string;
  accessToken?: string;
  email?: string;
  name?: string;
  username?: string;
  user?: {
    email?: string;
    name?: string;
    username?: string;
  };
}

@Injectable({ providedIn: 'root' })
export class AuthApiService {
  private readonly http = inject(HttpClient);

  login(credentials: LoginInput): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${apiURL}/auth/login`, credentials);
  }

  register(credentials: RegisterInput): Observable<void> {
    return this.http
      .post(`${apiURL}/auth/register`, credentials, { responseType: 'text' })
      .pipe(map(() => undefined));
  }
}
