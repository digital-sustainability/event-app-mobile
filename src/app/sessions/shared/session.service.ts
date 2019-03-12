import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Session } from '../shared/session'
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  constructor(
    private _http: HttpClient,
  ) { }

  // TODO: Store in environment
  private _api = 'https://event-app.fdn-dev.iwi.unibe.ch/';

  getSessionById(id: number): Observable<Session> {
    return this._http.get<Session>(this._api + 'session/' + id);
  }
}