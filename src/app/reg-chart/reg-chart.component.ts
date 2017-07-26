import {Component, Input, OnInit} from '@angular/core';
import {SalesHistory} from "../event";

@Component({
  selector: 'app-reg-chart',
  templateUrl: './reg-chart.component.html',
  styleUrls: ['./reg-chart.component.css']
})
export class RegChartComponent implements OnInit {
  @Input() salesHistory: SalesHistory[];

  constructor() {
  }

  ngOnInit() {
  }

}
