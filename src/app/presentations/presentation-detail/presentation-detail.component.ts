import { Component, OnInit } from '@angular/core';
import { Presentation } from '../shared/models/presentation';
import { Speaker } from '../shared/models/speaker';
import { PageRoute, RouterExtensions } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, of } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '../../shared/services/navigation.service';
import { PresentationService } from '../shared/services/presentation.service';
import { Button } from 'tns-core-modules/ui/button'
import { EventData } from 'tns-core-modules/data/observable'
import { openUrl } from 'tns-core-modules/utils/utils'
import { orderBy } from 'lodash';
import * as moment from 'moment';
import * as dialogs from "tns-core-modules/ui/dialogs";
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
  private _speakers: Speaker[];
  
  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService,
    private _routerExtensions: RouterExtensions,
    ) { }
    
    ngOnInit(): void {
      this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const presentationId = params.id;
        // const presentationId = 1; // TODO: Remove – Testing only
        this._presentationService.getPresentation(presentationId)
        .pipe(
          catchError(err => {
            // TODO: Create generally shared error handler
            return throwError(err);
          })
          )
          .subscribe(
            (presentation: Presentation) => {
              this._presentation = presentation;
              this._presentationTitle = presentation.title;
              this._speakers = presentation.speakers;
              this.checkSpeakerPhoto();
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
    // TODO: Same navigation/animation bug as above!
    this._routerExtensions.navigate(['/speaker', id], {
      animated: false,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });
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

  getPhotoUrlOfSpeaker(speaker: Speaker) {
    if (!speaker.photo_url) {
      return '~/images/load_homer.png';
    }
    return speaker.photo_url
  }

  getStartTime(time: string | Date): string {
    if (time) {
      if (moment(time).isSame(moment(), 'day')) {
        return 'Heute, ' + moment.utc(time).format('HH:mm') + ' Uhr';
      }
      return moment.utc(time).locale('de').format('D. MMMM YYYY, HH:mm') + ' Uhr';
    } else {
      return ' - '
    }
  }

  concatRoom(room: string): string {
    if (room) {
      return `, ${room}`;
    }
    return '';
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

  get speakers(): Speaker[] {
    return orderBy(this._speakers, ['first_name']);
  }

  get presentation(): Presentation {
    return this._presentation;
  }

  get presentationTitle(): string {
    return this._presentationTitle;
  }

  get loading(): boolean {
    return this._loading;
  }

}
