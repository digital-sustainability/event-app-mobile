import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Session } from '../shared/models/session';
import { Observable } from 'rxjs';
import { EnvironmentManagerService } from '~/app/shared-module/services/environment-manager.service';
import { Speaker } from '../shared/models/speaker';

@Injectable()
export class SessionService {

  constructor(
    private _http: HttpClient,
    private _envManager: EnvironmentManagerService,
  ) {
    this._api = this._envManager.getEventApi();
  }

  private _api: string;

  getSession(id: number): Observable<Session> {
    return this._http.get<Session>(`${this._api}session/${id}`);
  }

  getSpeakers(id: number): Observable<Speaker[]> {
    return this._http.get<Speaker[]>(`${this._api}session/${id}/speaker`);
  }
}