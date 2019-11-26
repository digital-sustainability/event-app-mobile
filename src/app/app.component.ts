import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
import { UiService } from './shared/services/ui.service';
import { Subscription } from 'rxjs';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { NavigationService } from './shared/services/navigation.service';
registerElement('CardView', () => CardView);
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    // get access to the drawer element
    @ViewChild(RadSideDrawerComponent, { static: true}) drawerComponent: RadSideDrawerComponent;
    private _drawerSub: Subscription;
    private _drawer: RadSideDrawer;

    constructor(
        private _uiService: UiService,
        private _changeDetectionRef: ChangeDetectorRef,
        private _navigationService: NavigationService,
    ) { }

    ngOnInit() {
        this._drawerSub = this._uiService.drawerState.subscribe(_ => {
            // prevent drawer to open at initiation, because _drawer exists only after view init
            if (this._drawer) {
                this._drawer.toggleDrawerState();
            } 
        });
    }
    
    // runs after template has been initialized
    ngAfterViewInit() {
        this._drawer = this.drawerComponent.sideDrawer;
        // check via change detection if UI has to be updated/rerendered
        this._changeDetectionRef.detectChanges();
    }

    ngOnDestroy() {
        if (this._drawerSub) {
            this._drawerSub.unsubscribe();
        }
    }

    onDrawerBtnTap(destination: string): void {
        this.drawerComponent.sideDrawer.toggleDrawerState();
        this._navigationService.navigateTo(`/${destination}`);
    }
}
