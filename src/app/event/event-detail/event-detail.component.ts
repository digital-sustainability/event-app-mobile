import { Component, OnInit } from '@angular/core';
import { Image } from 'tns-core-modules/ui/image';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Event } from '../shared/event';
import { EventService } from '../shared/event.service';


@Component({
  selector: 'ns-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css'],
  moduleId: module.id,
})
export class EventDetailComponent implements OnInit {

  private _event: Event;

  constructor(
    private _routerExtensions: RouterExtensions,
    private _pageRoute: PageRoute,
    private _eventService: EventService,
  ) { }

  ngOnInit(): void {
    this._pageRoute.activatedRoute
      .pipe(switchMap(activatedRoute => activatedRoute.params))
      .forEach(params => {
        // const eventId = params.id;
        const eventId = 1; // TODO: Remove – Testing only
        // TODO: Fetch from a local storage on service to limit https calls
        this._eventService.getEventById(eventId)
          .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            event => {
              console.log(event)
              this._event = event
            },
            err => console.log(err)
          )
      });
  }

  get event(): Event {
    return this._event;
  }

  onBackButtonTap(): void {
    this._routerExtensions.backToPreviousPage();
  }

}
