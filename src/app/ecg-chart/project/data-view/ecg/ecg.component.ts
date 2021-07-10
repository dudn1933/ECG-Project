import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-ecg',
  templateUrl: './ecg.component.html',
  styleUrls: ['./ecg.component.scss'],
})
export class EcgComponent implements OnInit,OnChanges {
  @Input() changeIndex: any[] = [];
  @Input() data: any = [];

  dataArray: any;
  startIndex: any;
  endIndex: any;

  constructor() {
    this.dataArray = [];
    this.startIndex = 0;
    this.endIndex = 0;
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log("ecgOnChanges : ", changes)
    // if (changes.data.previousValue) {
      this.dataArray = this.data.data;
      this.remove();
      this.ecgDrawChart();
    // }
  }
  

  ecgDrawChart() {
    const ecgSvg = d3.select('.ecg').append('svg');
    const width: any = document.querySelector('.ecg')?.clientWidth;
    const height: any = document.querySelector('.ecg')?.clientHeight;
    const margin = { left: 30, top: 10, right: 10, bottom: 20 };
    ecgSvg.attr('width', '100%').attr('height', '100%');
    // 0과 100을 state값으로 첫시작값과 마지막 시작값을 받아서 시작.
    const xScale: any = d3.scaleTime().range([0, width]);

    xScale.domain([
      // this.data.data[this.changeIndex[0]].ts,
      // this.data.data[this.changeIndex[1] - 1].ts,
      this.dataArray[this.changeIndex[0]].ts,this.dataArray[this.changeIndex[1]-1].ts
    ])

    const yScale: any = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top]);
      yScale.domain(d3.extent(this.dataArray, (d: any) => d.ecg));

    const myLine: any = d3
      .line()
      .x((d: any) => xScale(d.ts))
      .y((d: any) => yScale(d.ecg));

    ecgSvg
      .append('path')
      .datum(this.dataArray)
      .attr('class', 'ecg')
      .attr('fill', 'none')
      .attr('stroke-width', '1px')
      .attr('stroke', 'blue')
      .attr('d', myLine);
  }

  remove() {
    const ecgDOM: any = document.querySelector('.ecg');
    if(ecgDOM.hasChildNodes()) {
      ecgDOM.removeChild(ecgDOM.firstChild);
    }
  }
}
