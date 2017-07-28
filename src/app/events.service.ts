import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Event} from './event';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

export enum EventStatus {
  ALL = 'all',
  ENDED = 'ended',
  DRAFT = 'draft',
  LIVE = 'live',
  STARTED = 'started',
  CANCELED = 'canceled'
}

@Injectable()
export class EventsService {

  constructor(private http: Http) {
  }

  getEvents(status: string): Observable<Event[]> {
    const eventStatus: EventStatus = EventStatus[status.toUpperCase()];
    if (!eventStatus) {
      return Observable.of<Event[]>([]);
    }

    return this.http.get(`/api/events/${status}`).map((res: Response) => {
      let body = res.json();
      return body || {};
    });
  }

}
