import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { AppRoutingModule } from './app-routing.module';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives'

import { AppComponent } from './app.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { ActionBarComponent } from './shared/components/action-bar/action-bar.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { EventTabComponent } from './events/event-tab/event-tab.component';
import { UserFeedbackComponent } from './presentations/user-feedback/user-feedback.component';

import { EventService } from './events/shared/event.service';
import { SessionService } from './sessions/shared/session.service';
import { PresentationService } from './presentations/shared/services/presentation.service';
import { NavigationService } from './shared/services/navigation.service';
import { UserFeedbackService } from './presentations/shared/services/user-feedback.service';
import { UiService } from './shared/services/ui.service';
import { AboutComponent } from './fdn/about/about.component';
import { HttpInterceptorService } from './shared/services/http-interceptor.service';
import { FeedbackService } from './shared/services/feedback.service';

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
        NativeScriptUIDataFormModule,
        NativeScriptUISideDrawerModule
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
        UserFeedbackComponent,
        AboutComponent,
    ],
    providers: [
        EventService,
        SessionService,
        PresentationService,
        NavigationService,
        UserFeedbackService,
        UiService,
        FeedbackService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: HttpInterceptorService,
            multi: true
          },
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
