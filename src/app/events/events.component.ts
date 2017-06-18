import {Component, OnInit} from '@angular/core';
import {EventsService} from '../events.service';
import {Observable} from 'rxjs/Observable';
import {Event} from '../event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Observable<Event[]>;

  constructor(private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.events = this.eventsService.getEvents();
  }

}
