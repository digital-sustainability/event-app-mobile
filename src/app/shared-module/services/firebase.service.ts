import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
// import { AuthService } from './auth.service';
import { Observable, Subject } from 'rxjs';
import { HttpInterceptorService } from './http-interceptor.service';
import { HttpClient } from '@angular/common/http';
import { EnvironmentManagerService } from './environment-manager.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private messageSubject$ = new Subject<firebase.Message>();
  private api: string;

  constructor(
    private ngZone: NgZone,
    private http: HttpClient,
    private _envManager: EnvironmentManagerService,
    /*private authService: AuthService*/) {
      this.api = this._envManager.getEventApi();
    }

  initFirebase(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.ngZone.runOutsideAngular(() => {
        firebase.init({
          showNotifications: true,
          showNotificationsWhenInForeground: true,

          onMessageReceivedCallback: (message: firebase.Message) => {
            console.log('[Firebase] onMessageReceivedCallback:', { message });
            this.ngZone.run(() => {
              this.messageSubject$.next(message);
            });
          }
        })
          .then(() => {
            this.ngZone.run(() => {
              observer.next(false);
            });
          })
          .catch(error => {
            this.ngZone.run(() => {
              observer.error(error);
            });
          });
      });
    });
  }

  onMessageReceived(): Observable<firebase.Message> {
    return this.messageSubject$.asObservable();
  }

  subscribeToTopic(topic: Topic): Promise<any> {
    return firebase.subscribeToTopic(topic.identifier);
  }
  unsubscribeFromTopic(topic: Topic): Promise<any> {
    return firebase.unsubscribeFromTopic(topic.identifier);
  }

  getTopics(): Observable<Topic[]> {
    return this.http.get<Topic[]>(`${this.api}topic`);
  }
}

export interface Topic {
  id: number;
  identifier: string;
  title: string;
  description?: string;
}