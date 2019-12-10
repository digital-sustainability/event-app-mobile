import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { SharedModule } from '../shared-module/shared.module';
import { EventsRoutingModule } from './events-routing.module';

import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';

import { EventTabComponent } from './events/event-tab/event-tab.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { UserFeedbackComponent } from './presentations/user-feedback/user-feedback.component';
import { EventListComponent } from './events/event-list/event-list.component';

import { EventService } from './events/event.service';
import { SessionService } from './sessions/session.service';
import { UserFeedbackService } from './presentations/user-feedback.service';
import { PresentationService } from './presentations/presentation.service';

@NgModule({
  imports: [NativeScriptCommonModule, EventsRoutingModule, SharedModule, NativeScriptUIListViewModule],
  declarations: [
    EventTabComponent,
    EventListComponent,
    EventDetailComponent,
    SessionDetailComponent,
    PresentationDetailComponent,
    SpeakerDetailComponent,
    UserFeedbackComponent,
  ],
  providers: [EventService, SessionService, UserFeedbackService, PresentationService],
  schemas: [NO_ERRORS_SCHEMA],
})
export class EventsModule {}
