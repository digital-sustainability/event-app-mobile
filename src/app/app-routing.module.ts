import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { EventTabComponent } from './events/event-tab/event-tab.component';
import { FeedbackComponent } from './presentations/feedback/feedback.component';

const routes: Routes = [
    { path: '', component: SpeakerDetailComponent },
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: EventTabComponent },
    { path: 'event/:id', component: EventDetailComponent },
    { path: 'session/:id', component: SessionDetailComponent },
    { path: 'presentation/:id', component: PresentationDetailComponent },
    { path: 'speaker/:id', component: SpeakerDetailComponent },
    { path: 'feedback/:id', component: FeedbackComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
