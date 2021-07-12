import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss'],
})
export class DataListComponent implements OnInit {
  lists: { index: number; startTime: number; endTime: number }[];
  @Input() data: any = [];
  @Output() onClickNumber = new EventEmitter<number>();

  constructor() {
    this.lists = [];
  }

  ngOnInit(): void {
    setTimeout(() => {
      for (let i = 1; i < this.data.length; i++) {
        this.lists.push({
          index: i,
          startTime: this.data[i].start,
          endTime: this.data[i].end,
        });
      }
    }, 500);
  }

  clickNumberRegister(value: number) {
    this.onClickNumber.emit(value);
  }

  calcTime(start: number, end: number) {
    const totalTime = (end - start) / 1000;
    const hour = parseInt(`${totalTime / 3600}`);
    const min = (parseInt(`${totalTime % 3600}`) / 60).toFixed(0);
    let sec = (totalTime % 60).toFixed(0);
    if (sec.length === 1) {
      sec = sec.padStart(2, `${0}`);
    }
    return `${hour}H:${min}M:${sec}S`;
  }
}
