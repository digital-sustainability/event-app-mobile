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

  // TODO: What is better: Default image or empty?
  // private _image_path: string;
  private _image_path = '~/images/load.png';

  constructor(
    private _routerExtensions: RouterExtensions,
    private _pageRoute: PageRoute,
    private _eventService: EventService,
    private _navigationService: NavigationService,
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

  onSessionTap(args: TouchGestureEventData): void {
    const tappedSession = args.view.bindingContext;
    this._navigationService.navigateTo('/session', tappedSession.id);
  }
  
  onBackButtonTap(): void {
    this._routerExtensions.navigate(['/home']);
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

}
