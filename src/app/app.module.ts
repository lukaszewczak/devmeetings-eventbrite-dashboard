import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {HttpModule} from '@angular/http';

import {AppComponent} from './app.component';
import {EventsComponent} from './events/events.component';
import {EventsService} from './events.service';
import { RegChartComponent } from './reg-chart/reg-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    EventsComponent,
    RegChartComponent
  ],
  imports: [
    BrowserModule,
    HttpModule
  ],
  providers: [EventsService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
