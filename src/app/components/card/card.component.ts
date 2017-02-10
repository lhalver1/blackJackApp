import { Component, Input } from '@angular/core';
// import { ChangeDisplayPipe } from '../../pipes/change-display-pipe';


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
