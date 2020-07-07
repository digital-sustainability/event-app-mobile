import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptModule } from 'nativescript-angular/nativescript.module';
import { NativeScriptUISideDrawerModule } from 'nativescript-ui-sidedrawer/angular/side-drawer-directives';
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared-module/shared.module';
import { FdnModule } from './fdn-module/fdn.module';
import { EventsModule } from './events-module/events.module';

import { AppComponent } from './app.component';
import { SettingsComponent } from './shared-module/components/settings/settings.component';

// Uncomment and add to NgModule imports if you need to use two-way binding
// import { NativeScriptFormsModule } from 'nativescript-angular/forms';

// Uncomment and add to NgModule imports if you need to use the HttpClient wrapper
// import { NativeScriptHttpClientModule } from 'nativescript-angular/http-client';

@NgModule({
  bootstrap: [AppComponent],
  imports: [
    NativeScriptModule,
    AppRoutingModule,
    FdnModule,
    EventsModule,
    SharedModule.forRoot(),
    NativeScriptUISideDrawerModule
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
