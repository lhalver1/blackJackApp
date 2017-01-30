import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Player } from '../../models/player';
import { Deck } from '../../models/deck';


@Component({
  selector: 'game-page',
  templateUrl: 'game.html'
})
export class GamePage {
  players: Player[];
  deck: Deck;

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Get the players
    this.players = [
      new Player("Player", [], false, "Human", 0, 0),
      new Player("Dealer", [], false, "CPU", 0, 0)
    ];

    // Get the deck of cards
    this.deck = new Deck();
    this.deck.buildDeck()
    this.deck.shuffle();

  }

}// End GamePage
