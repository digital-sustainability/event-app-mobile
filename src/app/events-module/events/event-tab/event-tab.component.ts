import { Component, ViewChild, ElementRef } from '@angular/core';
import { isAndroid } from 'tns-core-modules/platform';
import { UiService } from '~/app/shared-module/services/ui.service';
import { FirebaseService } from '~/app/shared-module/services/firebase.service';

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
    private firebaseService: FirebaseService
  ) {
    // Init firebase
    /*this.firebaseService.initFirebase()
      .subscribe((complete) => {
        if (complete) {
          console.log('firebase initialized')
        }
      }, (err) => {
        console.log('[Firebase]', err);
        if (err === 'Firebase already initialized') {
          
        } else {

        }
      });*/
  }

  onToggleMenu(): void {
    this._uiService.toggleDrawer();
  }

  get android(): boolean {
    return isAndroid;
  }

  onToggleCategoryFilter(categoryId: number): void{
    if(this.isCategoryIdSelected(categoryId))
      // don't display this category
      this.selectedCategoryIds.splice(this.selectedCategoryIds.indexOf(categoryId), 1);
    else
      // display this category
      this.selectedCategoryIds.push(categoryId);
    
    this.selectedCategoryIds = this.selectedCategoryIds.slice(); //new array for change detection
  }

  isCategoryIdSelected(categoryId: number): boolean {
    if(this.selectedCategoryIds.indexOf(categoryId) == -1)
      return false;
    else
      return true;
  }


}
