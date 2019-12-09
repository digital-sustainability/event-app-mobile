import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private _drawerState = new BehaviorSubject<void>(null);

  constructor() { }

  get drawerState() {
    return this._drawerState.asObservable();
  }

  toggleDrawer() {
    return this._drawerState.next(null);
  }

}
