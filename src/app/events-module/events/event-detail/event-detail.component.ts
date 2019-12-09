import { Component, OnInit } from '@angular/core';
import { Image } from 'tns-core-modules/ui/image';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Event } from '../shared/event';
import { Speaker } from '../../presentations/shared/models/speaker';
import { EventService } from '../shared/event.service';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { NavigationService } from '../../../shared-module/services/navigation.service';
import { Session } from '../../sessions/shared/session';
import { openUrl } from 'tns-core-modules/utils/utils';
import { Directions } from "nativescript-directions";
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
  private _mapsAvailable: boolean;
  private _speakers: Speaker[];
  public backRoute = '/home'
  public directions: any;

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
    /**
     * The activatedRoute obj of PageRoute will always be availabe even if the
     * page was fetched from cache. This would not be the case with ActivatedRoute
     * from @angular/router.
     */
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
        this._eventService.getSpeakers(eventId)
          .pipe(
            catchError(err => {
              // TODO: set (and create) error flag for event
              return throwError(err);
            })
          )
          .subscribe(
            (speakers: Speaker[]) => this._speakers = speakers,
            err => console.error(err)
          )
      });
    // instantiate maps plugin
    this.directions = new Directions();
    // check if device has a maps application
    this.directions.available().then((available: boolean) => {
      this._mapsAvailable = available;
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

  onOpenUrl(url: string): void {
    openUrl(url);
  }

  onOpenMaps(address: string): void {
    this.directions.navigate({
      // from: { // optional, default 'current location'
      //   lat: ... ,
      //   lng: ...
      // },
      /* Pass collection with propert "address" to use waypoints.
       * The last item is the destination, the addresses in between are 'waypoints'.
       */
      to: {
        address: address,
      },
      type: "transit", // optional, can be: driving, transit, bicycling or walking
      ios: {
        preferGoogleMaps: true,
        /**
         * If Google Maps is not installed, use Apple Maps but there are no waypoints available.
         * If waypoints are needed, option to precedence GoogleMapsWeb over Apple Maps.
         */
        allowGoogleMapsWeb: false
      }
    }).then(() => {
      console.log("Maps app launched.");
    }, error => {
      console.log(error);
    });
  }

  onSpeakerTap(id: number): void {
    // TODO: Same navigation/animation bug as above!
    this._routerExtensions.navigate(['/speaker', id], {
      animated: false,
        transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });
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

  get mapsAvailable(): boolean {
    return this._mapsAvailable;
  }

  get speakers(): Speaker[] {
    return this._speakers;
  }

  getPhotoUrlOfSpeaker(speaker: Speaker) {
      if (!speaker.photo_url) {
        return '~/images/load_homer.png';
      }
      return speaker.photo_url
  }

}
