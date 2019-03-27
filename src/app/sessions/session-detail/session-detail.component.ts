import { Component, OnInit } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Session } from '../shared/session';
import { Image } from 'tns-core-modules/ui/image';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NavigationService } from '~/app/shared/navigation.service';
import { Presentation } from '../../presentations/shared/presentation';
import { sortBy } from 'lodash';


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
  public backRoute = '/home';

  constructor(
    private _sessionService: SessionService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this._pageRoute.activatedRoute
    .pipe(switchMap(activatedRoute => activatedRoute.params))
    .forEach(params => {
      const sessionId = params.id;
      // const sessionId = 1; // TODO: Remove – Testing only
      this._sessionService.getSession(sessionId)
        .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            (session: Session) => {
              this._loading = false;
              this._session = session;
            },
            err => console.error(err)
          )
      });
  }

  onPresentationTap(id: number): void {
    this._navigationService.navigateTo('/presentation', id);
  }

  onBackButtonTap(): void {
    this._navigationService.navigateTo('/home');
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

  get presentations(): Presentation[] {
    // return sortBy(this._presentations, [(o: Presentation) => o.start]);
    return sortBy(this.session.presentations, ['start']);
  }

  get labelPresentations(): string {
    // TODO: insert this.session.label_presentations
    if (false) {
      return this.session.label_presentations;
    }
    return 'Präsentationen'
  }  
}
