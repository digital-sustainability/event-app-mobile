import { NgModule } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { SharedModule } from '../shared-module/shared.module';
import { EventsRoutingModule } from './events-routing.module';

import { EventTabComponent } from './events/event-tab/event-tab.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { UserFeedbackComponent } from './presentations/user-feedback/user-feedback.component';
import { EventListComponent } from './events/event-list/event-list.component';

import { NativeScriptUIListViewModule } from 'nativescript-ui-listview/angular';


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
  ]
})
export class EventsModule {}
