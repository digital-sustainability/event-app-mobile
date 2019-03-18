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

  getEvents(archive = false): Observable<Event[]> {
    // get date of tomorrow in a MYSQL compatible format
    const tomorrow = new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
      .toISOString().slice(0, 19).replace('T', ' ')
    if (archive) {
      return this._http.get<Event[]>(`${this._api}event?where={"end":{"<":"${tomorrow}"}}`);
    } else {
      return this._http.get<Event[]>(`${this._api}event?where={"end":{">=":"${tomorrow}"}}`);
    }
  }  

  getEvent(id: number): Observable<Event> {
    return this._http.get<Event>(this._api + 'event/' + id);
  }
}
