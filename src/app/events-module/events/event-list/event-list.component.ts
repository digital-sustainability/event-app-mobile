import { Component, OnInit, Input } from '@angular/core';
import { EventService } from '../event.service';
import { Event } from '../../shared/models/event';
import { of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { isIOS } from 'tns-core-modules/platform';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { orderBy } from 'lodash';
import * as moment from 'moment';
import { categories } from 'tns-core-modules/trace/trace';

@Component({
  selector: 'ns-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.css'],
  moduleId: module.id,
})
export class EventListComponent implements OnInit {
  
  @Input() archive: boolean;
  private _events: Event[];
  private _unfilteredEvents: Event[];
  private _loading = true;
  private _selectedCategoryIds = [];

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
            this._unfilteredEvents = orderBy(events, ['start'], ['desc']).filter(e => e.published);
          } else {
            this._unfilteredEvents = orderBy(events, ['start'], ['asc']).filter(e => e.published);
          }

          // add default font to HTML (for iOS) and remove all links
          if(isIOS) {
            this._unfilteredEvents.forEach(event => {
              if(event.formatted_description) {
                event.formatted_description = event.formatted_description.replace(/<a[^>]*>/gi, ''); // remove all links
                event.formatted_description = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 14;\">" + event.formatted_description + "</span>";
              }
            });
          } else {
            this._unfilteredEvents.forEach(event => {
              if(event.formatted_description)
                event.formatted_description = event.formatted_description.replace(/<a[^>]*>/gi, ''); // remove all links
            });
          }

          // filter by categories
          this.refreshFilteredEvents();

          this._loading = false;
      },
        err => console.error(err)
    );
  }

  refreshFilteredEvents(): void {
    if(this._selectedCategoryIds.length == 0)
      this._events = this._unfilteredEvents;
    else
      this._events = this._unfilteredEvents.filter((event) => {
        var found = false;

        if(event.categories) 
          event.categories.forEach((category) => {
            if(this._selectedCategoryIds.indexOf(category.id) !=-1)
              found = true;
          });

        return found;
      });
  }

  onToggleCategoryFilter(categoryId: number): void{
    if(this._selectedCategoryIds.indexOf(categoryId) == -1)
      // display this category
      this._selectedCategoryIds.push(categoryId);
    else
      // don't display this category
      this._selectedCategoryIds.splice(this._selectedCategoryIds.indexOf(categoryId), 1);

    this.refreshFilteredEvents();
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
