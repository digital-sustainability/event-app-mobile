import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UiService {

  private _toggleDrawerState = new BehaviorSubject<void>(null);

  constructor() { }

  get toggleDrawerState() {
    return this._toggleDrawerState.asObservable();
  }

  toggleDrawer() {
    return this._toggleDrawerState.next(null);
  }

}
