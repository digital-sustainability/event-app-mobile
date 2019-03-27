import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Event } from '../shared/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared/navigation.service';
import { sortBy } from 'lodash';
import * as moment from 'moment';

@Component({
  selector: 'ns-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  moduleId: module.id,
})
export class EventListComponent implements OnInit {
  
  @Input() archive: boolean;
  private _events: Event[];
  private _loading = true;

  constructor(
    private _eventService: EventService,
    private _navigationService: NavigationService,
  ) { }

  ngOnInit(): void {
    this._eventService.getEvents(this.archive)
      .pipe(
        catchError(err => {
          /*
            TODO: set (and create) error flag
            return empty array on server error
          */
          return of([]);
        })
      )
      .subscribe(
        (events: Event[]) => {
          this._events = sortBy(events, [(o: Event) => o.start]);
          this._loading = false;
      },
        err => console.error(err)
    );
  }

  onEventTap(args: TouchGestureEventData): void  {
    const tappedEvent = args.view.bindingContext;
    this._navigationService.navigateTo('/event', tappedEvent.id);
  }

  displayEventInfo(time: string | Date, location: string): string {
    return moment.utc(time).locale('de').format('dddd, D. MMMM YYYY');
    // return moment.utc(time).locale('de').format('dddd, D. MMMM YYYY') + ', ' + location;
  }

  get events(): Event[] {
    return this._events;
  }

  get loading(): boolean {
    return this._loading;
  }

}
