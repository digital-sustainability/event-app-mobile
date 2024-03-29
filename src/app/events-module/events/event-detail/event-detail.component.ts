import { Component, OnInit, ViewChild, ElementRef, Directive, AfterViewInit } from '@angular/core';
import { Image } from 'tns-core-modules/ui/image';
import { RouterExtensions, PageRoute } from 'nativescript-angular/router';
import { switchMap, catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Event } from '../../shared/models/event';
import { Speaker } from '../../shared/models/speaker';
import { EventService } from '../event.service';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { isIOS, isAndroid, device } from 'tns-core-modules/platform';
import { NavigationService } from '~/app/shared-module/services/navigation.service';
import { Session } from '../../shared/models/session';
import { openUrl } from 'tns-core-modules/utils/utils';
import { Directions } from 'nativescript-directions';
import * as moment from 'moment';
import { EventData, View } from 'tns-core-modules/ui/page';
import { LoadEventData, WebView } from 'tns-core-modules/ui/web-view';
import { EnvironmentManagerService } from '~/app/shared-module/services/environment-manager.service';

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
  public directions: any;

  descriptionHeight: string = 'auto';
  descriptionExpanded: boolean = false;


  // TODO: What is better: Default image or empty?
  // private _image_path: string;
  private _image_path = '~/images/load.png';

  constructor(
    private _pageRoute: PageRoute,
    private _eventService: EventService,
    private _navigationService: NavigationService,
    private _routerExtensions: RouterExtensions,
    private _envManager: EnvironmentManagerService,
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
              this._event = event;
              this._eventTitle = event.title
              this._image_path = event.image_path; // TODO: Cache images
              this._sessions = event.sessions;

              event.categories.forEach((category) => {
                switch(category.id) {
                  case 1: category.image_path = '~/images/fdn_logo.png'; break;
                  case 2: category.image_path = '~/images/chopen.png'; break;
                  case 3: category.image_path = '~/images/parldigi.png'; break;
                  case 4: category.image_path = '~/images/digitalimpactnetwork.png'; break;
                  case 5: category.image_path = '~/images/dinacon.png'; break;
                  default: category.image_path = '';
                }
              });

              // sort sessions
              event.sessions.sort((sessionA: Session, sessionB: Session) => {
                const positionA = sessionA.position;
                const idA = sessionA.id;
                const positionB = sessionB.position;
                const idB = sessionB.id;
        
                let comparatorResult = 0;
                if (positionA !== 0 && positionB !== 0) {
                  // Check if one value is greater than the other; if equal, comparatorResult should remain 0.
                  if (positionA > positionB) {
                    comparatorResult = 1;
                  } else if (positionA < positionB) {
                    comparatorResult = -1;
                  } else {
                    if (idA > idB) {
                      comparatorResult = 1;
                    } else if (idA < idB) {
                      comparatorResult = -1;
                    }
                  }
                } else if (positionA !== 0) {
                  comparatorResult = -1;
                } else if (positionB !== 0) {
                  comparatorResult = 1;
                } else {
                  if (idA > idB) {
                    comparatorResult = 1;
                  } else if (idA < idB) {
                    comparatorResult = -1;
                  }
                }
        
                return comparatorResult * 1; // ascending
              });

              // add default font to HTML (for iOS)
              if(isIOS && this._event.formatted_description) {
                this._event.formatted_description = "<span style=\"font-family:-apple-system,BlinkMacSystemFont,Roboto,Oxygen,Ubuntu,Cantarell,Helvetica,sans-serif; font-size: 15;\">" + this._event.formatted_description + "</span>";
              }

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
          );
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
    /*this._routerExtensions.navigate(['/session', id], {
      animated: false,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });*/

    this._navigationService.navigateTo('/session', id);

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

  onOpenVideoConferencingLink(url: string): void {
    openUrl(url);
  }

  onOpenUrl(url: string): void {
    openUrl(url);
  }

  onDownloadICS(id: number): void {
    const api = this._envManager.getEventApi();
    openUrl(`${api}event/${id}/ics`);
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
    this._navigationService.navigateTo('/speaker', id);
  }

  getDuration(start: string | Date, end: string | Date): string {
    if (start && end) {
      return `${moment.utc(start).locale('de').format('HH:mm')} Uhr – ${moment.utc(end).locale('de').format('HH:mm')} Uhr`;
    } else {
      return 'tbd'
    }
  }

  concatRoom(room: string): string {
    if (room) {
      return `, ${room}`;
    }
    return '';
  }

  onPresentationTap(id: number): void {
    this._navigationService.navigateTo('/presentation', id);
  }

  onDescriptionLayoutChanged(args: EventData) {
    const view = <View>args.object;
    if (!this.descriptionExpanded && view.height === 'auto' && view.getActualSize().height > 100) {
      this.descriptionHeight = '100';
    }

    if (isIOS) {
      setTimeout(() => {
        view.requestLayout();
      }, 200);
    }
  }

  onExpandDescription() {
    this.descriptionHeight = 'auto';
    this.descriptionExpanded = true;
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

  get isFormattedDescriptionAvailable(): boolean {
    if(this._event.formatted_description)
      return true;
    else 
      return false;
  }

  getPhotoUrlOfSpeaker(speaker: Speaker) {
      if (!speaker.photo_url) {
        return '~/images/load_homer.png';
      }
      return speaker.photo_url
  }
}
