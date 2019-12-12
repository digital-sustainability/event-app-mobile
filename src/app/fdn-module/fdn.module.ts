import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FdnRoutingModule } from './fdn-routing.module';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
  imports: [NativeScriptCommonModule, FdnRoutingModule, SharedModule],
  declarations: [AboutComponent],
  schemas: [NO_ERRORS_SCHEMA],
})
export class FdnModule {}