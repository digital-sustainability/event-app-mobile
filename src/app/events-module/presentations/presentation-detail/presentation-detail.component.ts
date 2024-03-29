import { Component, OnInit } from '@angular/core';
import { Presentation } from '../../shared/models/presentation';
import { Speaker } from '../../shared/models/speaker';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { isIOS } from 'tns-core-modules/platform';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { PresentationService } from '../presentation.service';
import { Button } from 'tns-core-modules/ui/button'
import { EventData } from 'tns-core-modules/data/observable'
import { openUrl } from 'tns-core-modules/utils/utils'
import { orderBy } from 'lodash';
import * as moment from 'moment';
import * as dialogs from "tns-core-modules/ui/dialogs";
import { Session } from '../../shared/models/session';
import { Event } from '../../shared/models/event';
import { View } from 'tns-core-modules/ui/page';
// Second argument is optional.

@Component({
  selector: 'ns-presentation-detail',
  templateUrl: './presentation-detail.component.html',
  styleUrls: ['./presentation-detail.component.css'],
  moduleId: module.id,
})
export class PresentationDetailComponent implements OnInit {
  private _presentationTitle = 'Präsentation'
  private _loading = true;
  private _presentation: Presentation;
  private _event: Event;
  private _speakers: Speaker[];
  nonHierarchical: boolean = false;

  abstractHeight: string = 'auto';
  abstractExpanded: boolean = false;
  
  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _routerExtensions: RouterExtensions
    ) { }
    
    ngOnInit(): void {
      this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const presentationId = params.id;

        if(params.nonHierarchical) {
          this.nonHierarchical = true;
        } 

        this._presentationService.getPresentation(presentationId, true)
        .pipe(
          catchError(err => {
            // TODO: Create generally shared error handler
            return throwError(err);
          })
          )
          .subscribe(
            (presentation: Presentation) => {
              this._presentation = presentation;
              if(this._presentation.event_id) {
                this._event = (<Event>presentation.event_id);
              } else {
                this._event = (<Session>presentation.session_id).event_id;
              }
              
              this._presentationTitle = presentation.title;
              this._speakers = presentation.speakers;
              this.checkSpeakerPhoto();

              // add default font to HTML (for iOS)
              if(isIOS && this._presentation.formatted_abstract) {
                this._presentation.formatted_abstract = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 15;\">" + this._presentation.formatted_abstract + "</span>";
              }

              this._loading = false;
            },
            err => console.error(err)
            )
          });                                             
  }

  checkSpeakerPhoto(): void {
    this._speakers.forEach(speaker => {
      if(!speaker.photo_url) {
        speaker.photo_url = '~/images/load_homer.png';
      }
    });
  }

  // onSpeakerTap(args: TouchGestureEventData): void {
  //   const tappedSpeaker = args.view.bindingContext;
  //   this._navigationService.navigateTo('/speaker', tappedSpeaker.id);
  // }

  onSpeakerTap(id: number): void {
    this._navigationService.navigateTo('/speaker', id);
  }

  onFabTap(): void {
    // TODO: Only show if live chat is activated
    dialogs.login({
      title: 'Live Chat Login',
      message: `Bitte fügen Sie das Raum-Passwort für "${this._presentationTitle}" ein, um bei der Diskussion mitzumachen. Falls Sie anonym mitmachen wollen, geben Sie keinen Benutzernamen ein.`,
      okButtonText: "Los!",
      cancelButtonText: "Abbrechen",
      userNameHint: "Benutzername",
      passwordHint: "Raum-Passwort"
    }).then(response => {
      console.log(`Dialog login: ${response.result}; User: ${response.userName}; Pw: ${response.password}`);
    });
  }

  onUserFeedbackTap(args: EventData): void {
    // let button = <Button>args.object;
    this._navigationService.navigateTo('/feedback', this._presentation.id);
  }

  onShowSlides(url: string): void {
    console.log('|==>', url);
    openUrl(url);
  }

  onOpenVideoConferencingLink(url: string): void {
    openUrl(url);
  }

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

  getPhotoUrlOfSpeaker(speaker: Speaker) {
    if (!speaker.photo_url) {
      return '~/images/load_homer.png';
    }
    return speaker.photo_url
  }

  getDateString(start: string | Date, end: string | Date): string {
    if (start && end) {
      if (moment(start).isSame(moment(), 'day')) {
        return 'Heute, ' + moment.utc(start).format('HH:mm') + '-' + moment.utc(end).format('HH:mm') + ' Uhr';
      }
      return moment.utc(start).locale('de').format('D. MMMM YYYY, HH:mm') + '-' + moment.utc(end).format('HH:mm') + ' Uhr';
    } else {
      return ' - '
    }
  }

  // TODO: CHECK BEFORE NEXT EVENT!
  presentationStarted(): boolean {
    // check if presentation is not in the future
    return this._presentation.start && moment(moment()).isSameOrAfter(this._presentation.start, 'day');
  }

  isUrl(str: string): boolean {
    const urlExp = /[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi;
    const regex = new RegExp(urlExp);
    return str && str.length && regex.test(str);
  }

  hasEventDate(): boolean {
    if (this._event && this._event.start && this._event.end) {
      return true 
    } else {
      return false;
    }
  }
  hasEventLocation(): boolean {
    if (this._event.location) {
      return true;
    } else {
      return false;
    }
  }
  getEventDate(): string {
    const beginning = moment.utc(this._event.start).locale('de');
    const ending = moment.utc(this._event.end).locale('de');
    return `${beginning.format('dddd, D. MMMM YYYY von H')}h bis ${ending.format('H')}h`;
  }
  getEventLocation(): string {
    return this._event.location;
  }

  concatRoom(room: string): string {
    if (room) {
      return `, ${room}`;
    }
    return '';
  }

  get speakers(): Speaker[] {
    return orderBy(this._speakers, ['first_name']);
  }

  get presentation(): Presentation {
    return this._presentation;
  }

  get presentationTitle(): string {
    return this._presentationTitle;
  }

  get eventTitle(): string {
    if(this._event) {
      return this._event.title;
    } else {
      return '';
    }
  }

  get loading(): boolean {
    return this._loading;
  }

  get isFormattedAbstractAvailable(): boolean {
    if(this._presentation.formatted_abstract)
      return true;
    else 
      return false;
  }

  onNavigateToEvent() {
    this._navigationService.navigateTo('/event', this._event.id);
  }

}
