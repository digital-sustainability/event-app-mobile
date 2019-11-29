import { Component, OnInit } from '@angular/core';
import { NavigationService } from '../../shared/services/navigation.service';
import { openUrl } from 'tns-core-modules/utils/utils';
import { Directions } from 'nativescript-directions';

@Component({
  selector: 'ns-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  moduleId: module.id,
})
export class AboutComponent implements OnInit {

  private _mapsAvailable = false;
  public homepage = 'http://www.digitale-nachhaltigkeit.unibe.ch';
  public directions: any;

  constructor(
    private _navigationService: NavigationService,
  ) { }

  ngOnInit() {
    // instantiate maps plugin
    this.directions = new Directions();
    // check if device has a maps application
    this.directions.available().then((available: boolean) => {
      this._mapsAvailable = available;
    });
  }

  onBackButtonTap(): void {
    this._navigationService.navigateTo('/home');
  }

  onOpenUrl(): void {
    openUrl(this.homepage);
  }

  onOpenMaps(): void {
    this.directions.navigate({
      to: {
        address: 'Schützenmattstrasse 14 3012 Bern',
      },
      type: "transit",
      ios: {
        preferGoogleMaps: true,
        /**
         * If Google Maps is not installed, use Apple Maps but there are no waypoints available.
         * If waypoints are needed, option to precedence GoogleMapsWeb over Apple Maps .
         */
        allowGoogleMapsWeb: false 
      }
    }).then(() => {
      console.log('Maps app launched.');
    }, error => {
      console.log(error);
    });
  }

  get mapsAvailable(): boolean {
    return this._mapsAvailable;
  }

}
