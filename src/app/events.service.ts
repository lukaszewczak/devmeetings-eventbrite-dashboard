import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable} from 'rxjs/Observable';
import {Event} from './event';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class EventsService {

  constructor(private http: Http) {
  }

  getEvents(): Observable<Event[]> {
    return this.http.get('/api/events').map((res: Response) => {
      let body = res.json();
      return body || {};
    });
  }

}
