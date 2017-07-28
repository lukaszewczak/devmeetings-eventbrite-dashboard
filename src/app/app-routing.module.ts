import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {EventsComponent} from "./events/events.component";

const routes: Routes = [
  {
    path: ':status', component: EventsComponent
  }, {
    path: '',
    pathMatch: 'full',
    redirectTo: 'live'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {enableTracing: true})],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
