import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';
import { apiURL } from '../../api/config';
import { CreateItemInput, Item } from '../../api/data-contracts';

@Injectable({ providedIn: 'root' })
export class ItemsService {
  private readonly http = inject(HttpClient);

  getItems(teamId: string, state?: string): Observable<Item[]> {
    let params = new HttpParams().set('teamId', teamId);
    if (state) {
      params = params.set('state', state);
    }

    return this.http.get<Item[]>(`${apiURL}/items`, { params });
  }

  createItem(item: CreateItemInput): Observable<void> {
    return this.http
      .post(`${apiURL}/items`, item, { responseType: 'text' })
      .pipe(map(() => undefined));
  }

  changeState(itemId: string, state: string): Observable<void> {
    return this.http
      .post(`${apiURL}/items/${itemId}/state`, { state }, { responseType: 'text' })
      .pipe(map(() => undefined));
  }
}