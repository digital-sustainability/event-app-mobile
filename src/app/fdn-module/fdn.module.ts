import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { NativeScriptCommonModule } from 'nativescript-angular/common';
import { FdnRoutingModule } from './fdn-routing.module';
import { SharedModule } from '../shared-module/shared.module';

@NgModule({
    imports: [NativeScriptCommonModule, FdnRoutingModule, SharedModule],
    declarations: [AboutComponent],
    exports: [AboutComponent]
})

export class FdnModule { }