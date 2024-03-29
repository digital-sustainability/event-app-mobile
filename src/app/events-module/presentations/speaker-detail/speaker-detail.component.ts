import { Component, OnInit } from '@angular/core';
import { Presentation } from '../../shared/models/presentation';
import { Speaker } from '../../shared/models/speaker';
import { PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { isIOS } from 'tns-core-modules/platform';
import { NavigationService } from '~/app//shared-module/services/navigation.service';
import { PresentationService } from '../presentation.service';
import * as moment from 'moment';
import { Event } from '../../shared/models/event';
import { Session } from '../../shared/models/session';
import { EventData, View } from 'tns-core-modules/ui/page';

@Component({
  selector: 'ns-speaker-detail',
  templateUrl: './speaker-detail.component.html',
  styleUrls: ['./speaker-detail.component.css'],
  moduleId: module.id,
})
export class SpeakerDetailComponent implements OnInit {
  private _loading = true;
  private _speaker: Speaker;
  private _presentations: Presentation[];
  private _fullName = 'Speaker'

  shortBioHeight: string = 'auto';
  shortBioExpanded: boolean = false;
  
  constructor(
    private _presentationService: PresentationService,
    private _pageRoute: PageRoute,
    private _navigationService: NavigationService
  ) { }
  
  ngOnInit(): void {
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const speakerId = params.id;
        this._presentationService.getSpeaker(speakerId, true)
          .pipe(
            catchError(err => {
              // TODO: Create generally shared error handler
              return throwError(err);
            })
          )
          .subscribe(
            (speaker: Speaker) => {
              this._speaker = speaker;
              this._fullName = speaker.first_name + ' ' + speaker.last_name;
              this._presentations = speaker.presentations;

              // add default font to HTML (for iOS)
              if(isIOS && this._speaker.formatted_short_bio) {
                this._speaker.formatted_short_bio = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 15;\">" + this._speaker.formatted_short_bio + "</span>";
              }

              this._loading = false;
            },
            err => console.error(err)
          )
      });
  }

  onPresentationTap(id: number): void {
    this._navigationService.navigateTo('/presentation', id, false, true);
  }


  onShortBioLayoutChanged(args: EventData) {
    const view = <View>args.object;
    if (!this.shortBioExpanded && view.height === 'auto' && view.getActualSize().height > 100) {
      this.shortBioHeight = '100';
    }

    if (isIOS) {
      setTimeout(() => {
        view.requestLayout();
      }, 200);
    }
  }

  onExpandShortBio() {
    this.shortBioHeight = 'auto';
    this.shortBioExpanded = true;
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

  getEventInfo(presentation: Presentation): string {
    console.log(presentation.session_id, presentation.event_id)
    if (presentation.session_id) {
      console.log((<Session>presentation.session_id).event_id.title, 'first')
      return (<Session>presentation.session_id).event_id.title;
    } else {
      console.log((<Event>presentation.event_id).title, 'second')
      return (<Event>presentation.event_id).title;
    }

  }

  get speaker(): Speaker {
    return this._speaker;
  }

  get presentations(): Presentation[] {
    return this._presentations;
  }

  get fullName(): string {
    return this._fullName;
  }

  get imagePath(): string {
    if (!this.speaker.photo_url) {
      return '~/images/load_homer.png';
    }
    return this.speaker.photo_url
  }

  get loading(): boolean {
    return this._loading;
  }

  get position(): string {
    return this._speaker.position;
  }

  get organization(): string {
    return this._speaker.organization;
  }

  get shortBio(): string {
    return this._speaker.short_bio;
  }

  get formattedShortBio(): string {
    return this._speaker.formatted_short_bio;
  }

  get isFormattedShortBioAvailable(): boolean {
    if(this._speaker.formatted_short_bio)
      return true;
    else 
      return false;
  }

}