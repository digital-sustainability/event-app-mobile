import { NgModule } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Routes } from "@angular/router";
import { EventDetailComponent } from "./event/event-detail/event-detail.component";
import { EventListComponent } from "./event/event-list/event-list.component";

const routes: Routes = [
    { path: '', component: EventListComponent },
    // { path: '', component: EventDetailComponent },
    { path: 'event/:id', component: EventDetailComponent },
    // { path: "items", component: ItemsComponent },
    // { path: "item/:id", component: ItemDetailComponent }
];

@NgModule({
    imports: [NativeScriptRouterModule.forRoot(routes)],
    exports: [NativeScriptRouterModule]
})
export class AppRoutingModule { }
