import {Component, OnInit} from '@angular/core';
import {EventsService} from '../events.service';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/switchMap';
import {Event} from '../event';
import {ActivatedRoute, ParamMap, Router} from "@angular/router";

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {

  events: Observable<Event[]>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private eventsService: EventsService) {
  }

  ngOnInit(): void {
    this.events = this.route.paramMap.switchMap((params: ParamMap) =>
      this.eventsService.getEvents(params.get('status'))
    );
  }

}
