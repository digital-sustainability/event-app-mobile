import { Component, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Session } from '../shared/session';
import { Image } from 'tns-core-modules/ui/image';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';


@Component({
  selector: 'ns-session-detail',
  templateUrl: './session-detail.component.html',
  styleUrls: ['./session-detail.component.css'],
  moduleId: module.id,
})
export class SessionDetailComponent implements OnInit {

  private _session: Session;
  private _loading = true;

  constructor(
    private sessionService: SessionService,
    private _routerExtensions: RouterExtensions,
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
              console.log(this._session);
            },
            err => console.log(err)
          )
      });
  }

  get sessions(): Session {
    return this._session;
  }

  get loading(): boolean {
    return this._loading;
  }
  

}
