import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { ActionBarComponent } from './shared/action-bar/action-bar.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';

import { EventService } from './events/shared/event.service';
import { SessionService } from './sessions/shared/session.service';
import { PresentationService } from './presentations/shared/presentation.service';
import { NavigationService } from './shared/navigation.service';
import { EventTabComponent } from './events/event-tab/event-tab.component';
import { ArchiveListComponent } from './events/archive-list/archive-list.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativeScriptUIListViewModule,
    ],
    declarations: [
        AppComponent,
        EventListComponent,
        EventDetailComponent,
        SessionDetailComponent,
        ActionBarComponent,
        PresentationDetailComponent,
        SpeakerDetailComponent,
        EventTabComponent,
        ArchiveListComponent
    ],
    providers: [
        EventService,
        SessionService,
        PresentationService,
        NavigationService,
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
