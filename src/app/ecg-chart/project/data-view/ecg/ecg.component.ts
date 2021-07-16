import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-ecg',
  templateUrl: './ecg.component.html',
  styleUrls: ['./ecg.component.scss'],
})
export class EcgComponent implements OnInit,OnChanges {
  @Input() changeIndex: any[] = [];
  @Input() data: any = [];
  @Input() test: any;

  dataArray: any;
  saveArray: any;
  count: number = 5;

  rangeIndex: number = 0;

  constructor() {
    this.dataArray = [];
  }

  ngOnInit(): void {
    
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (!this.test) {
    //   this.dataArray = this.data.data.slice(this.changeIndex[0], this.changeIndex[1]);
    //   this.remove();
    //   this.ecgDrawChart();
    // } else {
    //   this.dataArray.push(this.data.data[this.changeIndex[1]]);
    //   this.dataArray.shift();
    //   console.log(this.dataArray.length)
    //   this.remove();
    //   this.ecgDrawChart();
    // }
    // if (this.test) {
    //   this.dataArray.push(this.data.data[this.changeIndex[1] + 1]);
    //   console.log(1, this.dataArray[this.dataArray.length - 1].ts - this.dataArray[0].ts);
    //   console.log(2, this.rangeIndex)
    //   while (this.dataArray[this.dataArray.length-1].ts - this.dataArray[0].ts !== this.rangeIndex) {
    //     this.dataArray.shift();
    //   }
      
    //   this.remove();
    //   this.ecgDrawChart();
    // } else if (!this.test) {
      this.dataArray = this.data.data.slice(this.changeIndex[0], this.changeIndex[1]);
    //   this.rangeIndex = this.dataArray[this.dataArray.length-1].ts - this.dataArray[0].ts
    //   console.log(this.rangeIndex)
      this.remove()
      this.ecgDrawChart();
    // }
    
    // for (let i = 0; i < this.data.data.length; i++) {
    //   if (this.data.data[i].ts === undefined) {
    //     console.log(i);
    //   };
    // }
  }
  

  ecgDrawChart() {
    // d3.selectAll('svg').remove();
    const ecgSvg = d3.select('.ecg').append('svg');
    const boxHeight:any = document.querySelector('.ecgBox')?.clientHeight;
    const width: any = document.querySelector('.ecg')?.clientWidth;
    const height: any = document.querySelector('.ecg')?.clientHeight;
    const margin = { left: 40, top: 10, right: 10, bottom: 20 };

    ecgSvg.attr('width', '100%').attr('height', '100%');

    // 0과 100을 state값으로 첫시작값과 마지막 시작값을 받아서 시작.
    const xScale: any = d3.scaleTime()
      .range([0, width - margin.left]);
    xScale.domain(d3.extent(this.dataArray, (d: any) => d.ts));
    const yScale: any = d3
      .scaleLinear()
      .range([height-2 - margin.bottom, margin.top]);
    yScale.domain(d3.extent(this.dataArray, (d: any) => d.ecg));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);

    const ecgAxis = d3.select('.axis').append('svg').attr('width', '100%').attr('height','100%').attr('overflow','visible');

    ecgAxis.append('g').attr('transform',`translate(${40},${boxHeight-margin.bottom})`).call(xAxis);
    ecgAxis.append('g').attr('transform',`translate(${40},0)`).call(yAxis);

    const myLine: any = d3
      .line()
      .defined((d: any) => !isNaN(d.ecg))
      .x((d: any) => xScale(d.ts))
      .y((d: any) => yScale(d.ecg));

    ecgSvg
      .append('path')
      .datum(this.dataArray.filter(myLine.defined()))
      .attr('class', 'ecg')
      .attr('fill', 'none')
      .attr('stroke-width', '1px')
      .attr('stroke', 'white')
      .attr('d', myLine);

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
    const axisDom: any = document.querySelector('.axis');
    if(axisDom.hasChildNodes()) {
      axisDom.removeChild(axisDom.firstChild);
    }
  }
}
