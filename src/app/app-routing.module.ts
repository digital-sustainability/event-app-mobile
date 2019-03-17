import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';
import { PresentationDetailComponent } from './presentations/presentation-detail/presentation-detail.component';
import { SpeakerDetailComponent } from './presentations/speaker-detail/speaker-detail.component';
import { EventTabComponent } from './events/event-tab/event-tab.component';
import { ArchiveListComponent } from './events/archive-list/archive-list.component';

const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: EventTabComponent },
    // { path: '', component: PresentationDetailComponent },
    { path: 'event/:id', component: EventDetailComponent },
    { path: 'session/:id', component: SessionDetailComponent },
    { path: 'presentation/:id', component: PresentationDetailComponent },
    { path: 'speaker/:id', component: SpeakerDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
