import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Feedback } from './feedback';
import { Observable } from 'rxjs';
import { config } from '../../shared/config';

@Injectable({
  providedIn: 'root'
})
export class FeedbackService {

  private _api = config.api;

  constructor(
    private _http: HttpClient,
  ) { }

  getFeedback(id: number): Observable<Feedback> {
    return this._http.get<Feedback>(this._api + 'feedback/' + id);
  }

  addFeedback(feedback: Feedback): Observable<Feedback> {
    if (feedback.handle === null) {
      feedback.handle = 'Anonym'
    }
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    };
    return this._http.post<Feedback>(this._api + 'feedback', feedback, httpOptions);
  }
}