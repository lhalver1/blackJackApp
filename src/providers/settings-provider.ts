import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';

import { Settings } from '../models/settings';
import { Player } from '../models/player';

@Injectable()
export class SettingsProvider {
  player: Player;
  database: SQLite;
  settings: Settings;

  constructor(public platform: Platform, public http: Http) {
    debugger;
    this.platform.ready().then(() => {
        this.database = new SQLite();
        this.database.openDatabase({
          name: "blackJackDB.db",
          location: "default"
        }).then(() => {
            this.initSettings();
        }, (error) => {
            console.error("Unable to open database in app.component", error);
        });
      });

      //For Browser
    this.settings = new Settings(2000, false, false, 'greenPoker', 'redDiamonds', 'material', 'vegas');
  }

  getSettings(): Settings {
    return this.settings;
  }

  setTableBackground(backgroundName: string): void {
    this.settings.selectedBackground = backgroundName;
  }

  setCardBack(cardBackName: string): void {
    this.settings.selectedCardBack = cardBackName;
  }

  setCardFront(cardFrontName: string) {
    this.settings.selectedCardFront = cardFrontName;
  }

  initSettings() {
    this.database.executeSql("SELECT * FROM players", []).then((data) => {
        if(data.rows.length > 0) {
            for(var i = 0; i < data.rows.length; i++) {
                let row = data.rows.item(i);
                this.player = new Player(row.id, row.name, [], row.money, false, "Human", 0, 0);
            }
            this.database.executeSql("SELECT * FROM settings", []).then((settingsdata) => {
                if(settingsdata.rows.length > 0) {
                    for(var i = 0; i < settingsdata.rows.length; i++) {
                        let settingsRow = settingsdata.rows.item(i);
                        if (settingsRow.player_id === this.player.id) {
                            this.settings = new Settings(settingsRow.cpu_time, false, false, settingsRow.background, settingsRow.cardBack, settingsRow.cardFront, settingsRow.chips);
                            break;
                        }
                    }
                } else {
                    //Settings table is empty
                    this.settings = new Settings(2000, false, false, 'greenPoker', 'redDiamonds', 'material', 'vegas');
                }
            }, (error) => {
                console.log("ERROR: " + JSON.stringify(error));
            });
        } else {
            //No Players in db
            this.settings = new Settings(2000, false, false, 'greenPoker', 'redDiamonds', 'material', 'vegas');
        }
    }, (error) => {
        console.log("ERROR: " + JSON.stringify(error));
    });
  }

}
