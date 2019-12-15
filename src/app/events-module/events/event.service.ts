import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Event } from '../shared/models/event';
import { Speaker } from '../shared/models/speaker';
import { Observable } from 'rxjs';
import { EnvironmentManagerService } from '~/app/shared-module/services/environment-manager.service';

@Injectable()
export class EventService {

  private _api: string;

  constructor(
    private _http: HttpClient,
    private _envManager: EnvironmentManagerService,
  ) {
    this._api = this._envManager.getEventApi();
  }

  getEvents(archive = false): Observable<Event[]> {
    // get date of tomorrow in a MySQL compatible format
    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
      .toISOString().slice(0, 19).replace('T', ' ');
    const params = new HttpParams()
      .set('archive', archive.toString())
      .set('date', tomorrow);
    return this._http.get<Event[]>(`${this._api}event/schedule`, { params: params });
  }  

  getEvent(id: number): Observable<Event> {
    return this._http.get<Event>(`${this._api}event/${id}`);
  }
  
  getSpeakers(id: number): Observable<Speaker[]> {
    return this._http.get<Speaker[]>(`${this._api}event/${id}/speaker`);
  }
}
