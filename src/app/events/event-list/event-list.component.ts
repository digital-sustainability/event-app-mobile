import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Event } from '../shared/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { isIOS } from 'tns-core-modules/platform';
import { NavigationService } from '~/app/shared/services/navigation.service';
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

          // add default font to HTML (for iOS)
          if(isIOS) {
            this._events.forEach(event => {
              if(event.formatted_description)
                event.formatted_description = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 14;\">" + event.formatted_description + "</span>";
            });
          }

          this._loading = false;
      },
        err => console.error(err)
    );
  }

  onEventTap(event: Event): void  {
    this._navigationService.navigateTo('/event', event.id);
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
