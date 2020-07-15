import { NgModule } from '@angular/core';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { EventTabComponent } from './events/event-tab/event-tab.component';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { UserFeedbackComponent } from './presentations/user-feedback/user-feedback.component';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: EventTabComponent },
  { path: 'event/:id', component: EventDetailComponent },
  { path: 'session/:id', component: SessionDetailComponent },
  { path: 'presentation/:id', component: PresentationDetailComponent },
  { path: 'presentation/:id/:nonHierarchical', component: PresentationDetailComponent },
  { path: 'speaker/:id', component: SpeakerDetailComponent },
  { path: 'feedback/:id', component: UserFeedbackComponent },
];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class EventsRoutingModule {}
