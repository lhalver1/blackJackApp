import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { SettingsProvider } from '../../providers/settings-provider';

import { Settings } from '../../models/settings';
import { Player } from '../../models/player';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: Settings;
  database: SQLite;
  player: Player;
  storeDBItem: any;

  constructor(public platform: Platform, public navCtrl: NavController, public navParams: NavParams, public service: SettingsProvider) {
    this.settings = this.service.getSettings();
    this.platform.ready().then(() => {
          this.database = new SQLite();
          this.database.openDatabase({name: "blackJackDB.db", location: "default"}).then(() => {
              this.getPurchases();
          }, (error) => {
              console.log("ERROR in storePage on opening db: ", error);
          });
      });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
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
                            debugger;
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
                              console.log("settings: "+ JSON.stringify(this.settings));
                              console.log("storeDBItem: "+ JSON.stringify(this.storeDBItem));
                              break;
                          }
                      }
                      
                  } else {
                      // No row in store?
                      // this.addStoreRow(this.player);
                  }
              }, (error) => {
                  console.log("ERROR getting purchases in settingsPage: " + JSON.stringify(error));
              });
          } else {
              // No player in the db
              console.log("ERROR no players in settingsPage:");
          }
      }, (error) => {
          console.log("ERROR: " + JSON.stringify(error));
      });
      
  }//END getPurchasese()

  save() {
        this.database.executeSql("UPDATE settings SET background = '"+ this.settings.selectedBackground +
          "', cardFront = '"+ this.settings.selectedCardFront +
          "', cardBack = '"+ this.settings.selectedCardBack +
          "', chips = '"+ this.settings.chips +
          "', cpu_time = '"+ this.settings.cpuDecisionTime +
          "' WHERE id = "+ this.player.id +"", []).then((data) => {
            console.log("UPDATED settings table: " + JSON.stringify(this.settings));
        }, (error) => {
            console.log("ERROR: " + JSON.stringify(error.message));
        });
  }

  cancel() {
    this.getPurchases();
  }

}
