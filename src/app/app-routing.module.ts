import { NgModule } from '@angular/core';
import { NativeScriptRouterModule } from 'nativescript-angular/router';
import { Routes } from '@angular/router';
import { SettingsComponent } from './shared-module/components/settings/settings.component';

const routes: Routes = [
  { path: '', redirectTo: 'events', pathMatch: 'full' },
  { path: 'settings', component: SettingsComponent },
  { path: 'events', loadChildren: () => import('./events-module/events.module').then(m => m.EventsModule) },
  { path: 'fdn', loadChildren: () => import('./fdn-module/fdn.module').then(m => m.FdnModule) },
];

@NgModule({
  imports: [NativeScriptRouterModule.forRoot(routes)],
  exports: [NativeScriptRouterModule],
})
export class AppRoutingModule {}
