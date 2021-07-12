import {
  Component,
  OnInit,
  Input,
  SimpleChanges,
  Output,
  EventEmitter,
  OnChanges,
} from '@angular/core';
import * as d3 from 'd3';

@Component({
  selector: 'app-section',
  templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss'],
})
export class SectionComponent implements OnInit,OnChanges {
  @Input() data: any = [];
  @Input() test: any;

  dataArray: any;

  index:number[] = [];

  @Output() onRangeIndex = new EventEmitter<[number, number]>(); // brush의 첫값과 마지막 값으로 보여주는 chart 범위 조절하기.
  @Output() lastIndex = new EventEmitter<number>();

  startIndex: number = 0;
  endIndex: number = 0;
  constructor() {
    this.dataArray = [];
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.  

    this.dataArray = this.data.data;
    this.endIndex = this.data.data.length;
    this.remove();
    this.sectionDrawChart();
    this.slider(this.startIndex, this.endIndex);
    
    const timer = setInterval(() => {
      if (this.test) {
        this.remove();
        this.sectionDrawChart();
        this.slider(this.startIndex + 1, this.endIndex + 1);
      } else {
        clearInterval(timer);
        this.remove();
        this.sectionDrawChart();
        this.slider(this.startIndex, this.endIndex);
      }
    })
  }

  sectionDrawChart() {
    const svg = d3.select('.section').append('svg').attr('id', 'section-svg');
    const width: any = document.querySelector('.section')?.clientWidth;
    const height: any = document.querySelector('.section')?.clientHeight;
    const margin = { left: 30, top: 10, right: 10, bottom: 20 };
    svg.attr('width', '100%').attr('height', '100%');
    // 0과 100을 state값으로 첫시작값과 마지막 시작값을 받아서 시작.
    const xScale: any = d3.scaleTime().range([0, width]);
    xScale.domain(d3.extent(this.dataArray, (d: any) => d.ts));

    const yScale: any = d3
      .scaleLinear()
      .range([height - margin.bottom, margin.top]);
    yScale.domain(d3.extent(this.dataArray, (d: any) => d.ecg));

    const myLine: any = d3
      .line()
      .defined((d: any) => !isNaN(d.ecg))
      .x((d: any) => xScale(d.ts))
      .y((d: any) => yScale(d.ecg));

    svg
      .append('path')
      .datum(this.dataArray.filter(myLine.defined()))
      .attr('fill', 'none')
      .attr('stroke-width', '.5px')
      .attr('stroke', 'white')
      .attr('d', myLine);
      
    
    svg
      .append('path')
      .datum(this.dataArray)
      .attr('fill', 'none')
      .attr('stroke-width', '.5px')
      .attr('stroke', 'blue')
      .attr('d', myLine);
  }

  slider(min: number, max: number) {
    const onMove = this.test;
    const range = [min, max];
    const width: any = document.querySelector('.range-slider')?.clientWidth;
    const height: any = document.querySelector('.range-slider')?.clientHeight;

    const x = d3.scaleLinear().domain(range).range([0, width]);
    

    const svg: any = d3.select('.range-slider');
    svg
      .attr('width', width)
      .attr('height', height)

    const g = svg.append('g');

    const indexRegister = (min: number, max: number) => {
      //브러쉬 인덱스값 전달.
      this.onRangeIndex.emit([min, max]);
      this.lastIndex.emit(max);
      this.startIndex = min;
      this.endIndex = max;
      console.log(this.startIndex,this.endIndex)
    };

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('brush', function (event) {
        let s = event.selection;

        // console.log(x.invert(s[0]),x.invert(s[1]));
        indexRegister(
          Number(x.invert(s[0]).toFixed(0)),
          Number(x.invert(s[1]).toFixed(0))
        );
    
        // move brush handles
        handle
          .attr('display', null)
          .attr('transform', function (d: any, i: any) {
            return `translate(${[s[i], -height / 4]})`;
          });
        // update view
        // if the view should only be updated after brushing is over,
        // move these two lines into the on('end') part below
        svg.node().value = s.map(function (d: any) {
              var temp = x.invert(d);
              return +temp.toFixed(0);
        });
        
        svg.node().dispatchEvent(new CustomEvent('input'));
      });

    const gBrush = g.append('g').attr('class', 'brush').call(brush);

    var brushResizePath = function (d: any) {
      var e = +(d.type == 'e'),
        x = e ? 1 : -1,
        y = height / 2;
      return (
        'M' +
        0.5 * x +
        ',' +
        y +
        'A6,6 0 0 ' +
        e +
        ' ' +
        6.5 * x +
        ',' +
        (y + 6) +
        'V' +
        (2 * y - 6) +
        'A6,6 0 0 ' +
        e +
        ' ' +
        0.5 * x +
        ',' +
        2 * y +
        'Z' +
        'M' +
        2.5 * x +
        ',' +
        (y + 8) +
        'V' +
        (2 * y - 8) +
        'M' +
        4.5 * x +
        ',' +
        (y + 8) +
        'V' +
        (2 * y - 8)
      );
    };
    const handle = gBrush
      .selectAll('.handle--custom')
      .data([{ type: 'w' }, { type: 'e' }])
      .enter()
      .append('path')
      .attr('class', 'handle--custom')
      .attr('stroke', '#000')
      .attr('fill', '#eee')
      .attr('cursor', 'ew-resize')
      .attr('d', brushResizePath);

    gBrush
      .selectAll('.overlay')
      .each(function (d: any) {
        d.type = 'selection';
      })
      .on('mousedown touchstart', brushcentered);

    function brushcentered(): void {
      var dx = x(1) - x(0), // Use a fixed width when recentering.
        cx = d3.pointer(svg)[0],
        x0 = cx - dx / 2,
        x1 = cx + dx / 2;
      d3.select(svg.parentNode).call(
        brush.move,
        x1 > width ? [width - dx, width] : x0 < 0 ? [0, dx] : [x0, x1]
      );
    }

    // select entire range
    gBrush.call(brush.move, range.map(x));

    return svg.node();
  }

  remove() {
    const sectionDOM:any = document.querySelector('.section');
    if (sectionDOM?.hasChildNodes()) {
      sectionDOM.removeChild(sectionDOM.firstChild);
    }
    const rangeDOM:any = document.querySelector(".range-slider");
    if(rangeDOM.hasChildNodes()) {
      rangeDOM.removeChild(rangeDOM.firstChild);
    }
  }
}
