import { Injectable } from '@angular/core';
import { TouchGestureEventData } from 'tns-core-modules/ui/gestures/gestures';
import { RouterExtensions } from 'nativescript-angular/router';
import { ActivatedRoute } from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  constructor(
    private _routerExtensions: RouterExtensions,
    private activeRoute: ActivatedRoute
  ) { }

  navigateTo(path: string, id?: number): void {
    const config = {
      animated: true,
      transition: {
        name: "slide",
        duration: 200,
        curve: "ease"
      }
    };
    if (id) {
      this._routerExtensions.navigate([path, id], config);
    } else {
      this._routerExtensions.navigate([path], config);
    }
  }

  navigateBack(): void {
    if(this._routerExtensions.canGoBack())
      this._routerExtensions.back();
  }
}
