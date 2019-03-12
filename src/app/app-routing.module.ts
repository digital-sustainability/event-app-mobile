import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { EventDetailComponent } from './events/event-detail/event-detail.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { SessionDetailComponent } from './sessions/session-detail/session-detail.component';

const routes: Routes = [
    { path: '', component: EventListComponent },
    // { path: '', component: EventDetailComponent },
    { path: 'event/:id', component: EventDetailComponent },
    { path: 'session/:id', component: SessionDetailComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
