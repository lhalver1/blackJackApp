import { Component, ViewChild } from '@angular/core';
import { Platform, MenuController, Nav } from 'ionic-angular';
import { StatusBar, Splashscreen, SQLite } from 'ionic-native';

import { Page } from '../models/page';

import { WelcomePage } from '../pages/welcome/welcome';
import { GamePage } from '../pages/game/game';
import { StorePage } from '../pages/store/store';
import { SettingsPage } from '../pages/settings/settings';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make WelcomePage the root (or first) page
  rootPage: any = WelcomePage;
  pages: Array<Page>;
  db: SQLite;

  constructor(
    public platform: Platform,
    public menu: MenuController
  ) {
    this.initializeApp();

    // set our app's pages
    this.pages = [
      new Page('Welcome', WelcomePage, 'home' ),
      new Page('Game', GamePage, 'game-controller-b' ),
      new Page('Store', StorePage, 'cart'),
      new Page('Settings', SettingsPage, 'settings')
    ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      this.db = new SQLite();
      this.db.openDatabase({
        name: "blackJackDB.db",
        location: "default"
      }).then(() => {
          debugger;
          this.db.executeSql("DROP TABLE IF EXISTS players", {}).then((data) => {
              this.db.executeSql("DROP TABLE IF EXISTS store", {}).then((data) => {
                this.initTables();
              }, (error) => {
                  debugger;
                  console.error("Unable to execute sql", error);
              });
          }, (error) => {
              debugger;
              console.error("Unable to execute sql", error);
          });
          
      }, (error) => {
          debugger;
          console.error("Unable to open database", error);
      });

      Splashscreen.hide();
    });
  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  initTables() {
    this.db.executeSql("CREATE TABLE IF NOT EXISTS players (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, money INTEGER)", {}).then((data) => {
          debugger;
          console.log("players TABLE CREATED: ", data);
          this.db.executeSql("CREATE TABLE IF NOT EXISTS store(id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "player_id INTEGER, " + 
            "materialGreen_back TEXT, " +
            "pokerGreen_back TEXT, " + 
            "feltGreen_back, " +
            "spacePlanet_back, " +
            "spaceNight_back, " +
            "diamondsRed_cardBack, " +
            "material_cardFront, " +
            "classic_cardFront, " +
            "FOREIGN KEY(player_id) REFERENCES players(id))", {}).then((data) => {
              debugger;
              console.log("store TABLE CREATED: ", data);
          }, (error) => {
              debugger;
              console.error("Unable to execute sql", error);
          });
      }, (error) => {
          debugger;
          console.error("Unable to execute sql", error);
      });
  }
}
