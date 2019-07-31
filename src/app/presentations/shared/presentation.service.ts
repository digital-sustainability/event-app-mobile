import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Presentation } from './presentation';
import { Speaker } from './speaker';
import { Observable } from 'rxjs';
import { config } from '../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class PresentationService {

  private _api = config.api;

  constructor(
    private _http: HttpClient,
  ) { }

  getPresentation(id: number): Observable<Presentation> {
    return this._http.get<Presentation>(this._api + 'presentation/' + id);
  }

  getSpeaker(id: number): Observable<Speaker> {
    return this._http.get<Speaker>(this._api + 'speaker/' + id);
  }
}