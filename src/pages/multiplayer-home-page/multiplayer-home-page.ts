import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AngularFire, AuthProviders, AuthMethods, FirebaseListObservable } from 'angularfire2';

/*
 * table {
 *     name: string
 *     players: Player[],
 *     currentTurn: Player
 * }
 */


@Component({
  selector: 'page-multiplayer-home-page',
  templateUrl: 'multiplayer-home-page.html'
})
export class MultiplayerHomePage {
  tables: FirebaseListObservable<any>;
  searchTablesStr: string;
  players: FirebaseListObservable<any>;
  name: any;

  constructor(public navCtrl: NavController, public navParams: NavParams, public angularfire: AngularFire) {
    this.tables = this.angularfire.list('/tables');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MultiplayerHomePage');
  }

}
