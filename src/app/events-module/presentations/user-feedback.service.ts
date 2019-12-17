import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { UserFeedback } from '../shared/models/user-feedback';
import { Observable } from 'rxjs';
import { EnvironmentManagerService } from '~/app/shared-module/services/environment-manager.service';

@Injectable()
export class UserFeedbackService {

  private _api: string;

  constructor(
    private _http: HttpClient,
    private _envManager: EnvironmentManagerService
  ) {
    this._api = this._envManager.getEventApi();
  }

  getFeedback(id: number): Observable<UserFeedback> {
    return this._http.get<UserFeedback>(`${this._api}feedback/${id}`);
  }

  addFeedback(feedback: UserFeedback): Observable<UserFeedback> {
    if (feedback.handle === null || feedback.handle == '') {
      feedback.handle = 'Anonym'
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this._http.post<UserFeedback>(`${this._api}feedback`, feedback, httpOptions);
  }
}