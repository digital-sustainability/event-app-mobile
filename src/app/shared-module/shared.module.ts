import { NgModule, ModuleWithProviders } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { ActionBarComponent } from './components/action-bar/action-bar.component';

/* 
TODO Do all services need to be provided since they are already provided via `providedIn: 'root'`?
https://coryrylan.com/blog/tree-shakeable-providers-and-services-in-angular
TODO Are services tree-shakable?
*/
import { CsrfService } from './services/csrf.service';
import { FeedbackService } from './services/feedback.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { NavigationService } from './services/navigation.service';
import { UiService } from './services/ui.service';

// FIXME HttpClientModule needed here or in AppModule or both?
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  imports: [NativeScriptCommonModule],
  declarations: [ActionBarComponent],
  exports: [ActionBarComponent],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        NavigationService,
        UiService,
        FeedbackService,
        CsrfService,
        {
          provide: HTTP_INTERCEPTORS,
          useClass: HttpInterceptorService,
          multi: true,
        }
      ]
    };
  }
}
