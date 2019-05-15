import { Component, OnInit, Input } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';
import { UiService } from '../ui.service';
declare var android: any;

@Component({
  selector: 'ns-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
  moduleId: module.id,
})
export class ActionBarComponent implements OnInit {

  @Input() title: string;
  @Input() backRoute: string

  constructor(
    private _routerExtensions: RouterExtensions,
    private _uiService: UiService, 
  ) { }

  ngOnInit() {
  }
  
  navigateBack() {
    if (this.backRoute) {
      // Fixes a bug that sometimes the back button won't work on specific sites
      this._routerExtensions.navigate([this.backRoute]);
    } else {
      this._routerExtensions.back();
    }
  }

  onToggleMenu(): void {
    this._uiService.toggleDrawer();
  }

  get android(): boolean {
    return isAndroid;
  }

}
