import { NgModule, ModuleWithProviders, NO_ERRORS_SCHEMA } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActionBarComponent } from './components/action-bar/action-bar.component';

import { CsrfService } from './services/csrf.service';
import { FeedbackService } from './services/feedback.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { NavigationService } from './services/navigation.service';
import { UiService } from './services/ui.service';
import { EnvironmentManagerService } from './services/environment-manager.service';
import { FixHtmlViewDirective } from './directives/fix-html-view.directive';

@NgModule({
  imports: [NativeScriptCommonModule, HttpClientModule],
  declarations: [
    ActionBarComponent,
    FixHtmlViewDirective
  ],
  exports: [ActionBarComponent],
  schemas: [NO_ERRORS_SCHEMA],
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
        },
        EnvironmentManagerService,
      ],
    };
  }
}
