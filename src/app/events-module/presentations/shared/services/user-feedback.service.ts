import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserFeedback } from '../models/user-feedback';
import { Observable } from 'rxjs';
import { config } from '../../../../shared-module/config';

@Injectable({
  providedIn: 'root'
})
export class UserFeedbackService {

  private _api = config.api;

  constructor(
    private _http: HttpClient,
  ) { }

  getFeedback(id: number): Observable<UserFeedback> {
    return this._http.get<UserFeedback>(this._api + 'feedback/' + id);
  }

  addFeedback(feedback: UserFeedback): Observable<UserFeedback> {
    if (feedback.handle === null) {
      feedback.handle = 'Anonym'
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this._http.post<UserFeedback>(this._api + 'feedback', feedback, httpOptions);
  }
}