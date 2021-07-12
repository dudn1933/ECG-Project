import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { timer } from 'rxjs';

@Component({
  selector: 'app-view-controller',
  templateUrl: './view-controller.component.html',
  styleUrls: ['./view-controller.component.scss']
})
export class ViewControllerComponent implements OnInit {
  // @Output() onPlayIndex = new EventEmitter<[number,number]>();
  @Output() onPlayTest = new EventEmitter<boolean>();
  @Input() data: any;
  @Input() lastIndex: any;

  play = false;
  constructor() { }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
  }

  onPlay() {
    this.onPlayTest.emit(true);
  }

  onStop() {
    this.onPlayTest.emit(false);
  }
}
