import { isIOS } from 'tns-core-modules/platform';
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import { Session } from '../../shared/models/session';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { Presentation } from '../../shared/models/presentation';
import { sortBy } from 'lodash';
import * as moment from 'moment';
import { Speaker } from '../../shared/models/speaker';
import { EventData, View } from 'tns-core-modules/ui/page';
import { openUrl } from 'tns-core-modules/utils/utils';


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
  speakers: Speaker[];

  abstractHeight: string = 'auto';
  abstractExpanded: boolean = false;

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

              // sort sessions
              session.presentations.sort((presentationA: Presentation, presentationB: Presentation) => {
                const positionA = presentationA.position;
                const idA = presentationA.id;
                const positionB = presentationB.position;
                const idB = presentationB.id;
        
                let comparatorResult = 0;
                if (positionA !== 0 && positionB !== 0) {
                  // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                  if (positionA > positionB) {
                    comparatorResult = 1;
                  } else if (positionA < positionB) {
                    comparatorResult = -1;
                  } else {
                    if (idA > idB) {
                      comparatorResult = 1;
                    } else if (idA < idB) {
                      comparatorResult = -1;
                    }
                  }
                } else if (positionA !== 0) {
                  comparatorResult = -1;
                } else if (positionB !== 0) {
                  comparatorResult = 1;
                } else {
                  if (idA > idB) {
                    comparatorResult = 1;
                  } else if (idA < idB) {
                    comparatorResult = -1;
                  }
                }
        
                return comparatorResult * 1; // ascending
              });

              // add default font to HTML (for iOS)
              if(isIOS && this._session.formatted_abstract) {
                this._session.formatted_abstract = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 15;\">" + this._session.formatted_abstract + "</span>";
              }

              // get speakers
              this._sessionService.getSpeakers(this._session.id).subscribe(
                (speakers) => {
                  this.speakers = speakers;
                }
              )

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


  onAbstractLayoutChanged(args: EventData) {
    const view = <View>args.object;
    if (!this.abstractExpanded && view.height === 'auto' && view.getActualSize().height > 100) {
      this.abstractHeight = '100';
    }

    if (isIOS) {
      setTimeout(() => {
        view.requestLayout();
      }, 200);
    }
  }

  onExpandAbstract() {
    this.abstractHeight = 'auto';
    this.abstractExpanded = true;
  }

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

  get eventTitle(): string {
    if(this._session) {
      return this._session.event_id.title;
    } else {
      return '';
    }
  }

  get presentations(): Presentation[] {
    return this.session.presentations;
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

  getPhotoUrlOfSpeaker(speaker: Speaker) {
    if (!speaker.photo_url) {
      return '~/images/load_homer.png';
    }
    return speaker.photo_url
  }

  onSpeakerTap(id: number): void {
    // TODO: Same navigation/animation bug as above!
    this._navigationService.navigateTo('/speaker', id);
  }

  onOpenVideoConferencingLink(url: string): void {
    openUrl(url);
  }
}
