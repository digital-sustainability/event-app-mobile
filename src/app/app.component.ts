import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { registerElement } from 'nativescript-angular/element-registry';
import { UiService } from './shared-module/services/ui.service';
import { Subscription } from 'rxjs';
import { RadSideDrawerComponent } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { RadSideDrawer } from 'nativescript-ui-sidedrawer';
import { NavigationService } from './shared-module/services/navigation.service';
import { CardView } from 'nativescript-cardview';
import { FirebaseService, Topic } from './shared-module/services/firebase.service';
import { FeedbackService } from './shared-module/services/feedback.service';
import { FeedbackType } from 'nativescript-feedback';
import {
    getBoolean,
    setBoolean,
    getNumber,
    setNumber,
    getString,
    setString,
    hasKey,
    remove,
    clear
} from "tns-core-modules/application-settings";
import { setBool } from 'nativescript-plugin-firebase/crashlytics/crashlytics';
import { messaging } from "nativescript-plugin-firebase/messaging";
registerElement('CardView', () => CardView);
registerElement('Fab', () => require('nativescript-floatingactionbutton').Fab);
registerElement("Ripple", () => require("nativescript-ripple").Ripple);

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
        private _firebaseService: FirebaseService,
        private _feedbackService: FeedbackService
    ) { }

    ngOnInit() {
        this._drawerSub = this._uiService.drawerState.subscribe(_ => {
            // prevent drawer to open at initiation, because _drawer exists only after view init
            if (this._drawer) {
                this._drawer.toggleDrawerState();
            }
        });

        // Init firebase
        this._firebaseService.initFirebase()
        .subscribe((complete) => {
        if (complete) {
            console.log('firebase initialized')
        }
        }, (err) => {
        console.log('[Firebase]', err);
        if (err === 'Firebase already initialized') {
            
        } else {

        }
        });

        // show in-app push notifications
        this._firebaseService.onMessageReceived()
        .subscribe((message) => {
          this._feedbackService.show(FeedbackType.Info, message.title, message.body,
            10000, () => {
                if (message.data.redirectPath && message.data.redirectId) {
                    switch (message.data.redirectPath) {
                      case 'event':
                        this._navigationService.navigateTo('/event', message.data.redirectId);
                        break;
                      case 'session':
                        this._navigationService.navigateTo('/session', message.data.redirectId);
                        break;
                      case 'presentation':
                        this._navigationService.navigateTo('/presentation', message.data.redirectId);
                        break;
                      case 'speaker':
                        this._navigationService.navigateTo('/speaker', message.data.redirectId);
                        break;
                    }
                  }
            });
        });

        // if first run: show settings
        if(!hasKey('first-run')) {
            this._navigationService.navigateTo('/settings');
        }
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
