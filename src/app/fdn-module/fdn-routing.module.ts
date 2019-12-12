import { NgModule } from '@angular/core';
import { AboutComponent } from './about/about.component';
import { Routes } from '@angular/router';
import { NativeScriptRouterModule } from 'nativescript-angular/router';

const routes: Routes = [{ path: '', component: AboutComponent }];

@NgModule({
  imports: [NativeScriptRouterModule.forChild(routes)],
  exports: [NativeScriptRouterModule],
})
export class FdnRoutingModule {}
