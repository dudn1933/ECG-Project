import { Component, OnInit, Input, SimpleChanges, Output, EventEmitter } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-data-view',
  templateUrl: './data-view.component.html',
  styleUrls: ['./data-view.component.scss'],
})
export class DataViewComponent implements OnInit {
  @Input() dataArray: any = [];

  changeIndex: [number, number];
  index:any;
  lastIndexNumber:any;

  test: any;
  
  constructor() {
    this.changeIndex = [0, 0];
  }

  ngOnInit(): void {

  }

  ngOnChanges(changes: SimpleChanges): void {
    // 다른 리스트 눌렀을때 지우기
    const sectionDOM: any = document.querySelector('.section');
    const sliderDOM: any = document.querySelector('.range-slider');
    const ecgDOM: any = document.querySelector('.ecg');
    while (
      sectionDOM?.hasChildNodes() ||
      ecgDOM.hasChildNodes() ||
      sliderDOM.hasChildNodes()
    ) {
      sectionDOM.removeChild(sectionDOM.firstChild);
      ecgDOM.removeChild(ecgDOM.firstChild);
      sliderDOM.removeChild(sliderDOM.firstChild);
    }
  }
  changeIndexNumber(value: [any, any]) {
    this.index = [value[0], value[1]];
  }

  onPlayTest(value:boolean) {
    // this.index = [this.index[0] + value[0], this.index[1] + value[1]];
    // const newDate = new Date().getSeconds();
    // console.log(newDate)
    this.test = value;
  }

  lastIndex(value:number) {
    this.lastIndexNumber = value;
  }
}
