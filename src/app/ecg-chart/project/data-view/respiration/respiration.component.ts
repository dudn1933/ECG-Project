import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-respiration',
  templateUrl: './respiration.component.html',
  styleUrls: ['./respiration.component.scss']
})
export class RespirationComponent implements OnInit {
  @Input() changeIndex: any[] = [];
  @Input() data: any = [];

  dataArray:any[] = [];

  constructor() { }

  ngOnInit(): void {
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.dataArray = this.data.respirationData;
    this.remove();
    this.respirationDrawChart();
  }

  respirationDrawChart() {
    const respirationSVG = d3.select('.respiration').append('svg');
    const boxHeight:any = document.querySelector('.ecgBox')?.clientHeight;
    const width: any = document.querySelector('.respiration')?.clientWidth;
    const height: any = document.querySelector('.respiration')?.clientHeight;
    const margin = { left: 40, top: 10, right: 10, bottom: 20 };
    respirationSVG.attr('width', '100%').attr('height', '100%');
    // 0과 100을 state값으로 첫시작값과 마지막 시작값을 받아서 시작.
    const xScale: any = d3.scaleTime().range([0, width]);

    xScale.domain([this.dataArray[this.changeIndex[0]].ts,this.dataArray[this.changeIndex[1]-1].ts]);

    const yScale: any = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top]);
      yScale.domain(d3.extent(this.dataArray, (d: any) => d.res));

    const xAxis = d3.axisBottom(xScale);
    const yAxis = d3.axisLeft(yScale);
    
    const respirationAxis = d3.select('.respirationAxis').append('svg').attr('overflow', 'visible');
  
      respirationAxis.append('g').attr('transform',`translate(${40},${boxHeight-margin.bottom})`).call(xAxis)
      respirationAxis.append('g').attr('transform',`translate(${40},0)`).call(yAxis);

    const myLine: any = d3
      .line()
      .defined((d: any) => !isNaN(d.res))
      .x((d: any) => xScale(d.ts))
      .y((d: any) => yScale(d.res));
    
     respirationSVG
      .append('path')
      .datum(this.dataArray.filter(myLine.defined()))
      .attr('class', 'respiration')
      .attr('fill', 'none')
      .attr('stroke-width', '1px')
      .attr('stroke', 'white')
      .attr('d', myLine);

    respirationSVG
      .append('path')
      .datum(this.dataArray)
      .attr('class', 'respiration')
      .attr('fill', 'none')
      .attr('stroke-width', '1px')
      .attr('stroke', 'green')
      .attr('d', myLine);
  }

  remove() {
    const respirationDOM: any = document.querySelector('.respiration');
    const axis: any = document.querySelector('.respirationAxis');
    if(respirationDOM.hasChildNodes()) {
      respirationDOM.removeChild(respirationDOM.firstChild);
    }
    if (axis.hasChildNodes()) {
      axis.removeChild(axis.firstChild);
    }
  }

}
