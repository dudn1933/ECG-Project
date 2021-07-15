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
    if (changes.data.previousValue) {
      this.dataArray = this.data.data;
      console.log(this.dataArray.length)
      this.endIndex = this.data.data.length;
      this.remove();
      this.sectionDrawChart();
      this.slider(this.startIndex, this.endIndex);
    }

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
    
    // d3.select(".range-slider")
  }

  slider(min: number, max: number) {
    let brushIndex: number[] = [];
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

      console.log(min, max);
      
      //브러쉬 인덱스값 전달.
      this.onRangeIndex.emit([min, max]);
      this.lastIndex.emit(max);
      this.startIndex = min;
      this.endIndex = max;
    };

    const targetDomObserve: any = document.querySelector('.range-slider');

    const observer = new MutationObserver(() => {
      const selection: any = d3.select('.selection');
      const overlay: any = d3.select('.overlay');
      const selectionWidth = selection.node().getBoundingClientRect().width;
      let selectionLeftX = selection.node().getBoundingClientRect().left;
      let overlayLeftX = overlay.node().getBoundingClientRect().left;
      let selectionRightX = selectionLeftX + selectionWidth;

      indexRegister(
          Number(x.invert(selectionLeftX-overlayLeftX).toFixed(0)),
          Number(x.invert(selectionRightX-overlayLeftX).toFixed(0))
      );
    });
    
    observer.observe(targetDomObserve, { subtree: true, childList: true, attributes: true });
      

    const brush = d3
      .brushX()
      .extent([
        [0, 0],
        [width, height],
      ])
      .on('brush', function (event) {
        let s = event.selection;
        d3.select(".play").on("click", () => {
          const selection: any = d3.select('.selection');
          const selectionWidth = selection.node().getBoundingClientRect().width;
          return selection.transition().duration(50000).ease(d3.easeLinear).attr("x", width - selectionWidth);
        });

        d3.select('.stop').on("click", () => {
          console.log("스탑");
          const selection: any = d3.select('.selection');
          const overlay: any = d3.select('.overlay');
          let selectionLeftX = selection.node().getBoundingClientRect().left;
          let overlayLeftX = overlay.node().getBoundingClientRect().left;
          const selectionX: any = selectionLeftX - overlayLeftX;
          return selection.transition().duration(0).ease(d3.easeLinear).attr('x', selectionX);
        });
      });

    const gBrush = g.append('g').attr('class', 'brush').call(brush);
  
    // select entire range
    gBrush.call(brush.move, range.map(x))

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
