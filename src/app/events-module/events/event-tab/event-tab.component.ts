import { Component } from '@angular/core';
import { isAndroid } from 'tns-core-modules/platform';
import { UiService } from '~/app/shared-module/services/ui.service';

@Component({
  selector: 'ns-event-tab',
  templateUrl: './event-tab.component.html',
  styleUrls: ['./event-tab.component.css'],
  moduleId: module.id,
})
export class EventTabComponent {
  selectedCategoryIds = [];
  constructor(
    private _uiService: UiService,
  ) { }

  onToggleMenu(): void {
    this._uiService.toggleDrawer();
  }

  get android(): boolean {
    return isAndroid;
  }

  onToggleCategoryFilter(categoryId: number): void{
    if(this.selectedCategoryIds.indexOf(categoryId) == -1)
      // display this category
      this.selectedCategoryIds.push(categoryId);
    else
      // don't display this category
      this.selectedCategoryIds.splice(this.selectedCategoryIds.indexOf(categoryId), 1);
    
    this.selectedCategoryIds = this.selectedCategoryIds.slice(); //new array for change detection
  }


}
