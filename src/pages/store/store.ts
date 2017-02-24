import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

/*
  Generated class for the Store page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-store',
  templateUrl: 'store.html'
})
export class StorePage {
  storeFilter: string;
  backgrounds: any[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.storeFilter = 'all';
    this.backgrounds = [
      { title: 'Material Green', path: 'assets/img/materialBackground.png', description: 'A Google Material like background that looks like a poker table.', price: 9000, name: 'materialGreen' },
      { title: 'Green Felt', path: 'assets/img/background.png',description: 'A nice table to play some black jack with your friends on!', price: 8500, name: 'greenFelt' }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorePage');
  }

  buyBackground(backgroundObj: any) {
    // update db that user bought this background
    alert('You bought: ' + backgroundObj.title + ' for: $' + backgroundObj.price);
  }

  buyCardBack(cardBackName: string) {
    // update db that user bought this card back
    alert('You bought: ' + cardBackName);
  }

  buyCardFront(cardFrontName: string) {
    // update db that user bought this card front
    alert('You bought: ' + cardFrontName);
  }

}
