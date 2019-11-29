import { Component } from '@angular/core';
import { isAndroid } from 'tns-core-modules/platform';
import { UiService } from '../../shared/services/ui.service';

@Component({
  selector: 'ns-event-tab',
  templateUrl: './event-tab.component.html',
  styleUrls: ['./event-tab.component.css'],
  moduleId: module.id,
})
export class EventTabComponent {

  constructor(
    private _uiService: UiService,
  ) { }

  onToggleMenu(): void {
    this._uiService.toggleDrawer();
  }

  get android(): boolean {
    return isAndroid;
  }

}
