import { Injectable, NgZone } from '@angular/core';
import * as firebase from 'nativescript-plugin-firebase';
// import { AuthService } from './auth.service';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private messageSubject$ = new Subject<firebase.Message>();

  constructor(private ngZone: NgZone,
    /*private authService: AuthService*/) { }

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

  subscribeToTopic(topic: string): Promise<any> {
    return firebase.subscribeToTopic(topic);
  }
  unsubscribeFromTopic(topic: string): Promise<any> {
    return firebase.unsubscribeFromTopic(topic);
  }
}