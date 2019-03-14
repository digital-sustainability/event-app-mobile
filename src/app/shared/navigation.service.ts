import { Injectable } from '@angular/core';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { RouterExtensions } from 'nativescript-angular/router';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private _routerExtensions: RouterExtensions
  ) { }

  navigateTo(path: string, id: number): void {
    this._routerExtensions.navigate([path, id],
    {
      animated: true,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    });
    //TODO: Handle not existing routes
  }
}
