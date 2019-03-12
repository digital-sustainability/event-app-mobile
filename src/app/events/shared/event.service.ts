import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Event } from '../shared/event'
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class EventService {

  // TODO: Store in environment
  private _api = 'https://event-app.fdn-dev.iwi.unibe.ch/';

  constructor(
    private _http: HttpClient,
  ) { }

  getEvents(): Observable<Event[]> {
    return this._http.get<Event[]>(this._api + 'event');
  }

  getEventById(id: number): Observable<Event> {
    return this._http.get<Event>(this._api + 'event/' + id);
  }
}
