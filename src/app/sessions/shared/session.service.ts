import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Session } from '../shared/session'
import { Observable } from 'rxjs';
import { config } from '../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private _http: HttpClient,
  ) { }

  private _api = config.api;

  getSession(id: number): Observable<Session> {
    return this._http.get<Session>(this._api + 'session/' + id);
  }
}