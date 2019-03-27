import { Component, OnInit } from '@angular/core';
import { Image } from 'tns-core-modules/ui/image';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Event } from '../shared/event';
import { EventService } from '../shared/event.service';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared/navigation.service';
import { Session } from '../../sessions/shared/session';
import { openUrl } from 'tns-core-modules/utils/utils'
import * as moment from 'moment';

@Component({
  selector: 'ns-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  moduleId: module.id,
})
export class EventDetailComponent implements OnInit {

  private _event: Event;
  private _loading = true;
  private _eventTitle = 'Event';
  private _sessions: Session[];
  public backRoute = '/home'

  // TODO: What is better: Default image or empty?
  // private _image_path: string;
  private _image_path = '~/images/load.png';

  constructor(
    private _pageRoute: PageRoute,
    private _eventService: EventService,
    private _navigationService: NavigationService,
    private _routerExtensions: RouterExtensions
  ) { }

  ngOnInit(): void {
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        const eventId = params.id;
        // const eventId = 1; // TODO: Remove – Testing only
        // TODO: Fetch from a local storage on service to limit https calls
        this._eventService.getEvent(eventId)
          .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            (event: Event) => {
              this._event = event
              this._eventTitle = event.title
              this._image_path = event.image_path; // TODO: Cache images
              this._sessions = event.sessions;
              this._loading = false;
            },
            err => console.error(err)
          )
      });
  }

  onSessionTap(id: number): void {
    // const tappedSession = args.view.bindingContext;
    // this._navigationService.navigateTo('/session', tappedSession.id);
    // TODO: Somehow the code above does not work for (ONLY!) this component -> check
    // Routing does not work if animation is enabled!?
    this._routerExtensions.navigate(['/session', id], {
      animated: false,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });

  }
  
  onBackButtonTap(): void {
    this._navigationService.navigateTo('/home');
  }

  isOneDayEvent(start: string | Date, end: string | Date): boolean {
    return moment(start).format('L') === moment(end).format('L')
  }

  transformEventInfo(start: string | Date, end: string | Date): string {
    const beginning = moment.utc(start).locale('de')
    const ending = moment.utc(end).locale('de')
    return `${beginning.format('dddd, D. MMMM YYYY von H')}h bis ${ending.format('H')}h`
  }

  openUrl(url: string): void {
    openUrl(url);
  }

  get event(): Event {
    return this._event;
  }

  get eventTitle(): string {
    return this._eventTitle;
  }

  get imagePath(): string {
    return this._image_path;
  }

  get loading(): boolean {
    return this._loading;
  }

  get websiteTitle(): string {
    return this._event.url
  }

}
