import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SQLite } from 'ionic-native';

class StoreItem {
  public title: string;
  public path: string;
  public description: string;
  public price: number;
  public name: string;
  public owned: boolean;

  constructor(title: string, path: string, description: string, price: number, name: string, owned: boolean) {
    this.title = title;
    this.path = path;
    this.description = description;
    this.price = price;
    this.name = name;
    this.owned = owned;
  }
}

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
  database: SQLite;
  storeFilter: string;
  backgrounds: StoreItem[];
  cardFronts: StoreItem[];
  cardBacks: StoreItem[];
  chips: StoreItem[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.storeFilter = 'all';
    this.backgrounds = [
      new StoreItem( 'Green Poker', 'assets/img/backgrounds/greenPoker.png', 'A nice classic table to play some black jack with your friends on!', 8500, 'greenPoker', false ),
      new StoreItem( 'Red Poker', 'assets/img/backgrounds/redPoker.png', 'Red is for Warning, because with this table it shows you mean business!', 8500, 'greenPoker', false ),
      new StoreItem( 'Blue Poker', 'assets/img/backgrounds/bluePoker.png', 'A blue, calmning twist on the class green black jack table.', 8500, 'greenPoker', false ),
      new StoreItem( 'Green Felt', 'assets/img/backgrounds/greenFelt.png', 'A nice table to play some black jack with your friends on!', 2000, 'greenFelt', true ),
      new StoreItem( 'Space Night', 'assets/img/backgrounds/space_night.jpg', 'Nothing like playing cards under the night sky with a full moon!', 8500, 'spaceNight', false )
    ];
    this.cardFronts = [
      new StoreItem('Material', 'assets/img/cardImages/material/', 'A spin off of Google\'s material design, these cards are minimalistic and simple but beautiful.', 8000, 'material', true)
    ];
    this.cardBacks = [
      new StoreItem('Red Diamonds', 'assets/img/cardBacks/redDiamonds.png', 'Can\'t go wrong with the red diamonds, unless the dealer turns them over for BlackJack.', 2000, 'redDiamonds', true)
    ];
    this.chips = [
      new StoreItem('Vegas', 'assets/img/chips/vegas/', 'The good ole class vegas style chips. Certantly would love stacks of the gold chip.', 2000, 'vegasChips', true)
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StorePage');
  }

  buyBackground(backgroundObj: StoreItem) {
    // update db that user bought this background
    alert('You bought: ' + backgroundObj.title + ' for: $' + backgroundObj.price);
  }

  buyCardBack(cardBack: StoreItem) {
    // update db that user bought this card back
    alert('You bought: ' + cardBack.title);
  }

  buyCardFront(cardFront: StoreItem) {
    // update db that user bought this card front
    alert('You bought: ' + cardFront.title);
  }

  buyChips(chip: StoreItem) {
    // update db that user bought this chip
    alert('You bought: ' + chip.title);
  }

  getPurchases() {
        debugger;
        this.database.executeSql("SELECT * FROM store", []).then((data) => {
            if(data.rows.length > 0) {
                for(var i = 0; i < data.rows.length; i++) {
                    debugger;
                    // this.players.push({firstname: data.rows.item(i).firstname, lastname: data.rows.item(i).lastname});
                    let storeDBItem = {
                      playerId: data.rows.item(i).player_id
                    };
                    
                }
                
            } else {
                // No row in store?
            }
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error));
        });
    }

}
