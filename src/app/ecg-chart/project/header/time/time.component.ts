import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-time',
  templateUrl: './time.component.html',
  styleUrls: ['./time.component.scss'],
})
export class TimeComponent implements OnInit {
  @Input() dataArray: any = [];
  startTime: null | string;
  endTime: null | string;
  constructor() {
    this.startTime = null;
    this.endTime = null;
  }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.startTime = new Date(this.dataArray.start).toLocaleString();
    this.endTime = new Date(this.dataArray.end).toLocaleString();
  }
}
