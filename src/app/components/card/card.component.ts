import { Component, ViewChild, Input } from '@angular/core';


@Component({
    selector: 'card',
    templateUrl: './card.component.html'
})
export class CardComponent {
  @Input() suit: string;
  @Input() value: string;

  constructor() {
    
  }
}
