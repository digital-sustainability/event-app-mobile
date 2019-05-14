import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { CardView } from 'nativescript-cardview';
import { UiService } from './shared/ui.service';
import { Subscription } from 'rxjs';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
registerElement('CardView', () => CardView);
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);

@Component({
    selector: 'ns-app',
    moduleId: module.id,
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, AfterViewInit, OnDestroy {

    // get access to the drawer element
    @ViewChild(RadSideDrawerComponent) drawerComponent: RadSideDrawerComponent;
    private _drawerSub: Subscription;
    private _drawer: RadSideDrawer;

    constructor(
        private uiServie: UiService,
        private changeDetectionRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this._drawerSub = this.uiServie.toggleDrawerState.subscribe(_ => {
            // prevent drawer to render at initiation
            if (this._drawer) {
                this.drawerComponent.sideDrawer.toggleDrawerState();
            } 
        });
    }
    
    ngAfterViewInit() {
        this._drawer = this.drawerComponent.sideDrawer;
        // check via change detection if UI has to be updated
        this.changeDetectionRef.detectChanges();
    }

    ngOnDestroy() {
        if (this._drawerSub) {
            this._drawerSub.unsubscribe();
        }
    }
}
