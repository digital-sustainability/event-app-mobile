import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Presentation } from './presentation';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  // TODO: Store in environment
  private _api = 'https://event-app.fdn-dev.iwi.unibe.ch/';

  constructor(
    private _http: HttpClient,
  ) { }

  getEventById(id: number): Observable<Presentation> {
    return this._http.get<Presentation>(this._api + 'presentation/' + id);
  }
}