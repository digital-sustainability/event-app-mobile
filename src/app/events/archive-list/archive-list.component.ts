import { Component, OnInit } from '@angular/core';
import { EventService } from '../shared/event.service';
import { Event } from '../shared/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '~/app/shared/navigation.service';
import * as _ from 'lodash';

@Component({
  selector: 'ns-archive-list',
  templateUrl: './archive-list.component.html',
  styleUrls: ['./archive-list.component.css'],
  moduleId: module.id,
})
export class ArchiveListComponent implements OnInit {

  private _events: Event[];
  private _loading = true;

  constructor(
    private _eventService: EventService,
    private _navigationService: NavigationService,
  ) { }

  ngOnInit() {
    this._eventService.getEvents()
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
          /*
            TODO: TEMPORARY -> Replace by specific date filter routes
            Depending on tab choice send diffrent http request
          */
          this._events = _.filter(events, (o: Event) => {
                return new Date(o.start).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);
            });
          this._loading = false;
        },
        err => console.error(err)
      );
  }

  onEventTap(args: TouchGestureEventData): void {
    const tappedEvent = args.view.bindingContext;
    this._navigationService.navigateTo('/event', tappedEvent.id);
  }

  get events(): Event[] {
    return this._events;
  }

  get loading(): boolean {
    return this._loading;
  }

}
