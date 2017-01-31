import {Pipe} from '@angular/core';
 
@Pipe({
  name: 'shows'
})
export class ShowValuePipe {
  transform(value, args) {
    if(value === "Ace") {
        return "A";
    } else if(value === "King") {
        return "K";
    } else if(value === "Queen") {
        return "Q";
    } else if(value === "Jack") {
        return "J";
    }
  }
}