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

  navigateTo(path: string, id?: number, clearHistory?:boolean, nonHierarchical?:boolean): void {
    const config = {
      animated: true,
      transition: {
        name: "slide",
        duration: 150,
        curve: "ease"
      },
      clearHistory: clearHistory || false
    };
    if (id && !nonHierarchical) {
      this._routerExtensions.navigate([path, id], config);
    } else {
      this._routerExtensions.navigate([path], config);
    }

    if (id && nonHierarchical) {
      this._routerExtensions.navigate([path, id, true], config);
    }
  }

  navigateBack(): void {
    if(this._routerExtensions.canGoBack())
      this._routerExtensions.back();
  }
}
