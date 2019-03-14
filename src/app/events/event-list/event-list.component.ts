import { Component, OnInit } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { EventService } from '../shared/event.service';
import { Event } from '../shared/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';

@Component({
  selector: 'ns-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  moduleId: module.id,
})
export class EventListComponent implements OnInit {

  private _events: Event[]

  constructor(
    private _routerExtensions: RouterExtensions,
    private _eventService: EventService,
  ) { }

  ngOnInit() {
    this._eventService.getEvents()
      .pipe(
        catchError( err => {
          // TODO: set (and create) error flag
          // return empty array on server error
          return of([]);
        })
      )
      .subscribe(
        events => this._events = events,
        err => console.log(err)
    )
  }

  onEventTap(args: TouchGestureEventData): void  {
    const tappedEvent = args.view.bindingContext;
    this._routerExtensions.navigate(['/event', tappedEvent.id],
    {
      animated: true,
      transition: {
        name: "slide",
        duration: 300,
        curve: "ease"
      }
    });
  }

  get events(): Event[] {
    return this._events;
  }

}
