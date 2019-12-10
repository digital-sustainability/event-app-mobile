import { NgModule, ModuleWithProviders } from '@angular/core';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ActionBarComponent } from './components/action-bar/action-bar.component';

import { CsrfService } from './services/csrf.service';
import { FeedbackService } from './services/feedback.service';
import { HttpInterceptorService } from './services/http-interceptor.service';
import { NavigationService } from './services/navigation.service';
import { UiService } from './services/ui.service';

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
