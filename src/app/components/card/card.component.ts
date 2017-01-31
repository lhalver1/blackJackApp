import { Component, Input } from '@angular/core';
import { ShowValuePipe } from '../../pipes/card-value-pipe';


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
