import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-view-controller',
  templateUrl: './view-controller.component.html',
  styleUrls: ['./view-controller.component.scss']
})
export class ViewControllerComponent implements OnInit {
  @Output() onPlayIndex = new EventEmitter<[number,number]>();
  @Input() data: any;
  @Input() lastIndex: any;

  play = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    console.log(this.lastIndex);
    console.log(this.data)
  }

  onPlay(value:[number,number]) {
    console.log("실행")
    console.log(this.lastIndex, this.data.data.length)
    this.play = true;
    const timeControl = setInterval(() => {
      if(this.play && this.lastIndex < this.data.data.length) {
        this.onPlayIndex.emit(value);
      } else if(!this.play || this.lastIndex === this.data.data.length) {
        clearInterval(timeControl);
      }
    })
  }

  onStop() {
    this.play = false;
  }

}
