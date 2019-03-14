import { Component, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Session } from '../shared/session';
import { Image } from 'tns-core-modules/ui/image';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';


@Component({
  selector: 'ns-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.css'],
  moduleId: module.id,
})
export class SessionDetailComponent implements OnInit {

  private _session: Session;
  private _sessionTitle = 'Session';
  private _loading = true;

  constructor(
    private sessionService: SessionService,
    private _pageRoute: PageRoute,
  ) { }

  ngOnInit(): void {
    this._pageRoute.activatedRoute
    .pipe(switchMap(activatedRoute => activatedRoute.params))
    .forEach(params => {
      // const sessionId = params.id;
      const sessionId = 1; // TODO: Remove – Testing only
      this.sessionService.getSessionById(sessionId)
        .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            session => {
              this._loading = false;
              this._session = session;
              this._sessionTitle = session.title;
            },
            err => console.log(err)
          )
      });
  }

  onPresentationTap(args: TouchGestureEventData): void {
    console.log('PresentationTap');
    // const tappedSession = args.view.bindingContext;
    // this._routerExtensions.navigate(['/session', tappedSession.id],
    //   {
    //     animated: true,
    //     transition: {
    //       name: "slide",
    //       duration: 200,
    //       curve: "ease"
    //     }
    //   });
  }

  get session(): Session {
    return this._session;
  }

  get loading(): boolean {
    return this._loading;
  }

  get sessionTitle(): string {
    return this._sessionTitle;
  }
  

}
