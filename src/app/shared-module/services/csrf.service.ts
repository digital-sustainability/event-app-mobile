import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EnvironmentManagerService } from './environment-manager.service';

@Injectable({
  providedIn: 'root'
})
export class CsrfService {

  private _csrf: string;
  private _api: string;

  constructor(
    private _http: HttpClient,
    private _envManager: EnvironmentManagerService,
  ) {
    this._api = this._envManager.getEventApi();
  }

  requestCSRFToken(): Observable<string> {
    return this._http.get<any>(`${this._api}csrf-token`)
      .pipe(map((res) => {
        this._csrf = res._csrf;
        return res._csrf
      }));
  }

  getCSRFToken(): Observable<string> {
    if(this._csrf)
      return of(this._csrf);
    return this.requestCSRFToken();
  }

}
