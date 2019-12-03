import { Component, OnInit, ViewChild, ElementRef, Directive } from '@angular/core';
import { SessionService } from '../shared/session.service';
import { Session } from '../shared/session';
import { Image } from 'tns-core-modules/ui/image';
import { isIOS } from 'tns-core-modules/platform';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { NavigationService } from '~/app/shared/services/navigation.service';
import { Presentation } from '../../presentations/shared/presentation';
import { sortBy } from 'lodash';
import * as moment from 'moment';


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
    private _navigationService: NavigationService
  ) { }

  ngOnInit(): void {
    this._pageRoute.activatedRoute
    .pipe(switchMap(activatedRoute => activatedRoute.params))
    .forEach(params => {
      const sessionId = params.id;
      // const sessionId = 2; // TODO: Remove – Testing only
      this._sessionService.getSession(sessionId)
        .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            (session: Session) => {
              this._session = session;
              this._sessionTitle = session.title;

              // add default font to HTML (for iOS)
              if(isIOS) {
                this._session.abstract = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 14;\">" + this._session.abstract + "</span>";
              }

              this._loading = false;
            },
            err => console.error(err)
          )
      });
  }

  // TODO: On hold: implement in V0.2. HTTP req for every speaker needed
  // getFullName(first: string, last: string): string {
  //   if (first && last) {
  //     return `${first} ${last}`;
  //   }
  //   return 'tbd';
  // }
  
  // concatOrganization(org: string): string {
  //   if (org) {
  //     return `, ${org}`;
  //   }
  //   return '';
  // }

  getDuration(start: string | Date, end: string | Date): string {
    if (start && end) {
      return `${moment.utc(start).locale('de').format('HH:mm')} Uhr – ${moment.utc(end).locale('de').format('HH:mm')} Uhr`;
    } else {
      return 'tbd'
    }
  }

  concatRoom(room: string): string {
    if (room) {
      return `, ${room}`;
    }
    return '';
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
    return sortBy(this.session.presentations, ['start']);
  }

  get labelPresentations(): string {
    if (this.session.label_presentations) {
      return this.session.label_presentations;
    }
    return 'Präsentationen'
  }

  get isFormattedAbstractAvailable(): boolean {
    if(this._session.formatted_abstract)
      return true;
    else 
      return false;
  }
}
