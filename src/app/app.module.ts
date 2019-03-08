import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";
import { NativeScriptUIListViewModule } from "nativescript-ui-listview/angular";
import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from "@angular/common/http";

import { AppComponent } from "./app.component";
import { EventListComponent } from './event/event-list/event-list.component';
import { EventDetailComponent } from './event/event-detail/event-detail.component';

import { EventService } from "./event/shared/event.service";

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from "nativescript-angular/forms";

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from "nativescript-angular/http-client";

@NgModule({
    bootstrap: [
        AppComponent
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativeScriptUIListViewModule
    ],
    declarations: [
        AppComponent,
        EventListComponent,
        EventDetailComponent
    ],
    providers: [
        EventService
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule { }
