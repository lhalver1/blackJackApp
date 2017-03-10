import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { SettingsProvider } from '../providers/settings-provider';
import { PlayerProvider } from '../providers/player-provider';
import { StoreProvider } from '../providers/store-provider';

import { Page } from '../models/page';
import { Player } from '../models/player';

// import { WelcomePage } from '../pages/welcome/welcome';
import { GamePage } from '../pages/game/game';
import { StorePage } from '../pages/store/store';
import { SettingsPage } from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html',
  providers: [PlayerProvider, StoreProvider]
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  pages: Array<Page>;
  db: SQLite;
  player: Player;

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public settingsService: SettingsProvider
  ) {
        this.initializeApp();

        this.pages = [
        // new Page('Welcome', WelcomePage, 'home' ),
        new Page('Game', GamePage, 'game-controller-b' ),
        new Page('Store', StorePage, 'cart'),
        new Page('Settings', SettingsPage, 'settings')
        ];
  }

  initializeApp() {
      this.platform.ready().then(() => {
        
        StatusBar.styleDefault();
        this.db = new SQLite();
        this.db.openDatabase({
          name: "blackJackDB.db",
          location: "default"
        }).then(() => {
            this.initTables();
            // this.db.executeSql("DROP TABLE IF EXISTS players", {}).then((data) => {
            //     this.db.executeSql("DROP TABLE IF EXISTS store", {}).then((data) => {
            //       this.db.executeSql("DROP TABLE IF EXISTS settings", {}).then((data) => {
            //         this.initTables();
            //       }, (error) => {
            //           console.error("Unable to execute sql DROP TABLE IF EXISTS settings", error);
            //       });
            //     }, (error) => {
            //         console.error("Unable to execute sql DROP TABLE IF EXISTS store", error);
            //     });
            // }, (error) => {
            //     console.error("Unable to execute sql DROP TABLE IF EXISTS players", error);
            // });
            
        }, (error) => {
            // console.error("Unable to open database in app.component", error);
        });
  
      });
  }

    openPage(page) {
      this.menu.close();
      this.nav.setRoot(page.component);
    }

    initTables() {
      this.db.executeSql("CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, money INTEGER)", {}).then((data) => {
            // console.log("players TABLE CREATED: ", data);

            this.db.executeSql("SELECT * FROM players", []).then((data) => {
                if(data.rows.length > 0) {
                    this.player = new Player(data.rows.item(0).id, data.rows.item(0).name, [], data.rows.item(0).money, false, "Human", 0, 0);
                    this.createStoreTable();
                } else {
                    let newPlayer = new Player(-1, "Player", [], 2000, false, "Human", 0, 0);//Default player
                    this.db.executeSql("INSERT INTO players (name, money) VALUES (?, ?)", [newPlayer.name, newPlayer.money]).then((data) => {
                        // console.log("INSERTED into players: " + JSON.stringify(data));

                        this.db.executeSql("SELECT * FROM players", []).then((data) => {
                            if(data.rows.length > 0) {
                                this.player = new Player(data.rows.item(0).id, data.rows.item(0).name, [], data.rows.item(0).money, false, "Human", 0, 0);
                                this.createStoreTable();
                            } else {
                            }
                        }, (error) => {
                            // console.log("ERROR: " + JSON.stringify(error));
                        });


                    }, (error) => {
                        // console.log("ERROR: " + JSON.stringify(error.message));
                    });
                }
            }, (error) => {
                // console.log("ERROR: " + JSON.stringify(error));
            });

        }, (error) => {
            // console.error("Unable to execute sql CREATE TABLE IF NOT EXISTS players", error);
        });
    }

    createStoreTable() {
        this.db.executeSql("CREATE TABLE IF NOT EXISTS store(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "player_id INTEGER, " + 
          "greenPoker_back TEXT, " + 
          "redPoker_back TEXT, " + 
          "bluePoker_back TEXT, " + 
          "greenFelt_back TEXT, " +
          "spaceNight_back TEXT, " +
          "redDiamonds_cardBack TEXT, " +
          "geometric_cardBack TEXT, " +
          "material_cardFront TEXT, " +
          "classic_cardFront TEXT, " +
          "vegas_chips TEXT, " +
          "neon_chips TEXT, " +
          "FOREIGN KEY(player_id) REFERENCES players(id))", {}).then((data) => {
            // console.log("store TABLE CREATED: ", data);

            this.db.executeSql("SELECT * FROM store", []).then((data) => {
                if(data.rows.length > 0) {
                    this.createSettingsTable();
                } else {
                    this.db.executeSql("INSERT INTO store (player_id, greenPoker_back, redPoker_back, bluePoker_back, greenFelt_back, spaceNight_back, redDiamonds_cardBack, geometric_cardBack, material_cardFront, classic_cardFront, vegas_chips, neon_chips) " +
                    " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [this.player.id+'', 'false', 'false', 'false', 'true', 'false', 'true', 'false', 'false', 'true', 'true', 'false']).then((data) => {
                        // console.log("INSERTED into store: " + " VALUES ('"+ this.player.id +"', 'false', 'false', 'false', 'true', 'false', 'true', 'false', 'false', 'true', 'true', 'false')");
                        this.createSettingsTable();
                    }, (error) => {
                        // console.log("ERROR: " + JSON.stringify(error.message));
                    });
                }
            }, (error) => {
                // console.log("ERROR: " + JSON.stringify(error));
            });
        }, (error) => {
            // console.error("Unable to execute sql CREATE TABLE IF NOT EXISTS store", error);
        });
    }

    createSettingsTable() {
        this.db.executeSql("CREATE TABLE IF NOT EXISTS settings(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
          "player_id INTEGER, " + 
          "background TEXT, " + 
          "cardFront TEXT, " + 
          "cardBack TEXT, " + 
          "chips TEXT, " +
          "cpu_time TEXT, " +
          "FOREIGN KEY(player_id) REFERENCES players(id))", {}).then((data) => {
            // console.log("settings TABLE CREATED: ", data);

            this.db.executeSql("SELECT * FROM settings", []).then((data) => {
                if(data.rows.length > 0) {
                    this.rootPage = GamePage;
                    Splashscreen.hide();
                } else {
                    this.db.executeSql("INSERT INTO settings (player_id, background, cardFront, cardBack, chips, cpu_time) " +
                    " VALUES ('"+ this.player.id +"', 'greenFelt', 'classic', 'redDiamonds', 'vegas', '2000')", []).then((data) => {
                        // console.log("INSERTED into settings: VALUES ('"+ this.player.id +"', 'greenFelt', 'classic', 'redDiamonds', 'vegas', '2000')");
                        Splashscreen.hide();
                        this.rootPage = GamePage;
                    }, (error) => {
                        // console.log("ERROR: " + JSON.stringify(error.message));
                    });
                }
            }, (error) => {
                // console.log("ERROR: " + JSON.stringify(error));
            });
        }, (error) => {
            // console.error("Unable to execute sql CREATE TABLE IF NOT EXISTS settings", error);
        });
    }
}
