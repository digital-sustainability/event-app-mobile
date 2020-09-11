import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Presentation } from '../shared/models/presentation';
import { Speaker } from '../shared/models/speaker';
import { Observable } from 'rxjs';
import { EnvironmentManagerService } from '~/app/shared-module/services/environment-manager.service';

@Injectable()
export class PresentationService {

  private _api: string;

  constructor(
    private _http: HttpClient,
    private _evnManager: EnvironmentManagerService,
  ) {
    this._api = this._evnManager.getEventApi();
  }

  getPresentation(id: number, populated?:boolean): Observable<Presentation> {
    if(populated) {
      return this._http.get<Presentation>(`${this._api}presentation/${id}/populated`);
    } else {
      return this._http.get<Presentation>(`${this._api}presentation/${id}`);
    }
  }

  getSpeaker(id: number, populated?: boolean): Observable<Speaker> {
    if(populated) {
      return this._http.get<Speaker>(`${this._api}speaker/${id}/populated`);
    } else {
      return this._http.get<Speaker>(`${this._api}speaker/${id}`);
    }
  }
}