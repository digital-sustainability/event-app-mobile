// TODO Check for NO_ERROR_SCHEMA
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

// TODO Make sure these are in the right module
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUIDataFormModule } from 'nativescript-ui-dataform/angular';
import { HttpClientModule } from '@angular/common/http';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';



import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared-module/shared.module';
import { FdnModule } from './fdn-module/fdn.module';
import { EventsModule } from './events-module/events.module';
import { AppComponent } from './app.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    HttpClientModule,
    FdnModule,
    EventsModule,
    SharedModule.forRoot(),
    NativeScriptUIDataFormModule,
    NativeScriptUISideDrawerModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [],
  schemas: [NO_ERRORS_SCHEMA],
})
/*
Pass your application module to the bootstrapModule function located in main.ts to start your app
*/
export class AppModule {}
