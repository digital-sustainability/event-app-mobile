import { Component, OnInit, Input } from '@angular/core';
import { RouterExtensions } from 'nativescript-angular/router';
import { isAndroid } from 'tns-core-modules/platform';
import { UiService } from '../../services/ui.service';
declare var android: any;

@Component({
  selector: 'ns-action-bar',
  templateUrl: './action-bar.component.html',
  styleUrls: ['./action-bar.component.css'],
  moduleId: module.id,
})
export class ActionBarComponent implements OnInit {

  @Input() title: string;

  constructor(
    private _routerExtensions: RouterExtensions,
    private _uiService: UiService, 
  ) { }

  ngOnInit() {
  }
  
  navigateBack() {
    this._routerExtensions.back();
  }

  onToggleMenu(): void {
    this._uiService.toggleDrawer();
  }

  get android(): boolean {
    return isAndroid;
  }

}
