import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { Player } from '../../models/player';

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

@Component({
  selector: 'page-store',
  templateUrl: 'store.html'
})
export class StorePage {
  database: SQLite;
  storeDBItem: any;
  player: Player;
  storeFilter: string;
  backgrounds: StoreItem[];
  cardFronts: StoreItem[];
  cardBacks: StoreItem[];
  chips: StoreItem[];

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams) {
      this.platform.ready().then(() => {
          this.database = new SQLite();
          this.database.openDatabase({name: "blackJackDB.db", location: "default"}).then(() => {
              console.log("getting purchases");
              this.getPurchases();
          }, (error) => {
              console.log("ERROR in storePage on opening db: ", error);
          });
      });
      this.storeFilter = 'all';
  }

  ionViewDidLoad() {
      console.log('ionViewDidLoad StorePage');
  }

  buyBackground(backgroundObj: StoreItem) {
      if (this.player.money >= backgroundObj.price) {
          let columnName = backgroundObj.name + "_back";
          this.updateStoreTable(columnName, this.player.id, backgroundObj);
      } else {
          alert("Not Enough Funds to buy: " + backgroundObj.title);
      }
  }

  buyCardBack(cardBack: StoreItem) {
      if (this.player.money >= cardBack.price) {
          let columnName = cardBack.name + "_cardBack";
          this.updateStoreTable(columnName, this.player.id, cardBack);
      } else {
          alert("Not Enough Funds to buy: " + cardBack.title);
      }
  }

  buyCardFront(cardFront: StoreItem) {
      if (this.player.money >= cardFront.price) {
          let columnName = cardFront.name + "_cardFront";
          this.updateStoreTable(columnName, this.player.id, cardFront);
      } else {
          alert("Not Enough Funds to buy: " + cardFront.title);
      }
  }

  buyChips(chip: StoreItem) {
      if (this.player.money >= chip.price) {
          let columnName = chip.name + "_chips";
          this.updateStoreTable(columnName, this.player.id, chip);
      } else {
          alert("Not Enough Funds to buy: " + chip.title);
      }
  }


  updateStoreTable(columnName: string, player_id: number, item: StoreItem) {
      let newPlayerMoneyTotal = this.player.money - item.price;

       // update db that user bought this background
        alert('You bought: ' + item.title + ' for: $' + item.price);
        
        this.database.executeSql("UPDATE store SET "+ columnName +" = 'true' WHERE player_id = "+ player_id +"", []).then((data) => {
            console.log("Bought Background: " + JSON.stringify(data));
            this.database.executeSql("UPDATE players SET money = "+ newPlayerMoneyTotal +" WHERE id = "+ player_id+"", []).then((data) => {
                this.player.subtractMoney(item.price);
                console.log("UPDATED: " + JSON.stringify(data));
                this.getPurchases();
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error.message));
            });
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.message));
            console.log("sql statement: " + "UPDATE players SET money = "+ newPlayerMoneyTotal +" WHERE id = "+ player_id+"");
        }); 
  }


  getPurchases() {
      this.database.executeSql("SELECT * FROM players", []).then((data) => {
          if(data.rows.length > 0) {
              for(var i = 0; i < data.rows.length; i++) {
                let row = data.rows.item(i);
                  this.player = new Player(row.id, row.name, [], row.money, false, "Human", 0, 0);
              }
              this.database.executeSql("SELECT * FROM store", []).then((data) => {
                this.storeDBItem = {};
                  if(data.rows.length > 0) {
                      for(var i = 0; i < data.rows.length; i++) {
                          let dbItem = data.rows.item(i);
                          if (dbItem.player_id === this.player.id) {
                              this.storeDBItem = {
                                  'player_id': dbItem.player_id,
                                  'greenPoker': dbItem.greenPoker_back,
                                  'redPoker': dbItem.redPoker_back,
                                  'bluePoker': dbItem.bluePoker_back,
                                  'greenFelt': dbItem.greenFelt_back,
                                  'spaceNight': dbItem.spaceNight_back,
                                  'redDiamonds': dbItem.redDiamonds_cardBack,
                                  'material': dbItem.material_cardFront,
                                  'classic': dbItem.classic_cardFront,
                                  'vegas': dbItem.vegas_chips
                              };
                              break;
                          }
                      }
                      this.backgrounds = [
                        new StoreItem( 'Green Poker', 'assets/img/backgrounds/greenPoker.png', 'A nice classic table to play some black jack with your friends on!', 8500, 'greenPoker', this.storeDBItem['greenPoker'] === 'true' ),
                        new StoreItem( 'Red Poker', 'assets/img/backgrounds/redPoker.png', 'Red is for Warning, because with this table it shows you mean business!', 8500, 'redPoker', this.storeDBItem['redPoker'] === 'true' ),
                        new StoreItem( 'Blue Poker', 'assets/img/backgrounds/bluePoker.png', 'A blue, calmning twist on the class green black jack table.', 8500, 'bluePoker', this.storeDBItem['bluePoker'] === 'true' ),
                        new StoreItem( 'Green Felt', 'assets/img/backgrounds/greenFelt.png', 'A nice table to play some black jack with your friends on!', 2000, 'greenFelt', true ),
                        new StoreItem( 'Space Night', 'assets/img/storePics/space_night.jpg', 'Nothing like playing cards under the night sky with a full moon!', 8500, 'spaceNight', this.storeDBItem['spaceNight'] === 'true' )
                      ];
                      this.cardFronts = [
                        new StoreItem('Material', 'assets/img/storePics/material.png', 'A spin off of Google\'s material design, these cards are minimalistic and simple but beautiful.', 8000, 'material', true)
                      ];
                      this.cardBacks = [
                        new StoreItem('Red Diamonds', 'assets/img/storePics/redDiamonds.png', 'Can\'t go wrong with the red diamonds, unless the dealer turns them over for BlackJack.', 2000, 'redDiamonds', true)
                      ];
                      this.chips = [
                        new StoreItem('Vegas', 'assets/img/storePics/vegas.png', 'The good ol classic vegas style chips. Certainly would love stacks of the gold chip.', 2000, 'vegasChips', true)
                      ];
                      
                  } else {
                      // No row in store?
                      this.addStoreRow(this.player);
                  }
              }, (error) => {
                  console.log("ERROR getting purchases in storePage: " + JSON.stringify(error));
              });
          } else {
              // No player in the db
          }
      }, (error) => {
          console.log("ERROR: " + JSON.stringify(error));
      });
      
  }//END getPurchasese()

  addStoreRow(player: Player) {
        this.database.executeSql("INSERT INTO store (player_id, greenPoker_back, redPoker_back, bluePoker_back, greenFelt_back, spaceNight_back, redDiamonds_cardBack, material_cardFront, classic_cardFront, vegas_chips) " +
        " VALUES ('"+ player.id +"', 'false', 'false', 'false', 'true', 'false', 'true', 'true', 'false', 'true')", []).then((data) => {
            console.log("INSERTED into store: " + " VALUES ('"+ player.id +"', 'false', 'false', 'false', 'true', 'false', 'true', 'true', 'false', 'true')");
            this.getPurchases();
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.message));
        });
    }

}
