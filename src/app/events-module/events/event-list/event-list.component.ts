import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../shared/models/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { orderBy } from 'lodash';
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
  
  // TODO: Later --> Add pull-to-refresh
  ngOnInit(): void {
    this._eventService.getEvents(this.archive)
      .pipe(
        catchError(err => {
          /**
           * TODO: set (and create) error flag
           * return empty array on server error
           */
          return of([]);
        })
      )
      .subscribe(
        (events: Event[]) => {
          if (this.archive) {
            this._events = orderBy(events, ['start'], ['desc']).filter(e => e.published);
          } else {
            this._events = orderBy(events, ['start'], ['asc']).filter(e => e.published);
          }
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
  }

  get events(): Event[] {
    return this._events;
  }

  get loading(): boolean {
    return this._loading;
  }

}
