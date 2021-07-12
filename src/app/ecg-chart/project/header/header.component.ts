import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  @Input() dataArray: {}[] = [];
  constructor() {
  }

  ngOnInit(): void {}

}
