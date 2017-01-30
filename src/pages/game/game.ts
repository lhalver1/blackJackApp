import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Player } from '../../models/player';
import { Card } from '../../models/card';
import { Deck } from '../../models/deck';


@Component({
  selector: 'game-page',
  templateUrl: 'game.html'
})
export class GamePage {
  playerTurnIndex: number;
  players: Player[];
  deck: Deck;
  trash: Card[];

  constructor(public navCtrl: NavController, public navParams: NavParams) {
    // Get the players
    this.players = [
      new Player("Dealer", [], false, "CPU", 0, 0),
      new Player("Logan", [], false, "Human", 0, 0)
    ];

    // Get the deck of cards
    this.deck = new Deck();
    this.deck.buildDeck()
    this.deck.shuffle();
    
    this.dealOutCards();
  }

  ngAfterViewInit() {
  }

  /**
   * Deals out cards to the player and the dealer. First makes sure the
   * gaming flag is set and that both hands are empty, if not then it 
   * puts the cards in the hands in the trash pile.
   */
  dealOutCards() {
      // Take each players cards and push them to the trash and then
      // clear the players hand.
      for (var i = 0; i < this.players.length; i++) {
          var currPlayer = this.players[i];
          if (currPlayer.hand.length > 0) {
              for (var index = 0; index < currPlayer.hand.length; index++) {
                  var currCard = currPlayer.hand[index];
                  this.trash.push(currCard);
              }
              currPlayer.hand.splice(0, currPlayer.hand.length);// = [];
          }
      }

      // If there are 12 or less cards remaining do a reshuffle.
      if (this.deck.cards.length <= 12) {
          this.deck.buildDeck();
      } else {

          // Pass out cards to each player, each player gets 1 card
          // then each player gets their 2nd card.
          for(var x = 0; x < 2 ; x++) {
              for (var i = 0; i < this.players.length; i++) {
                  var currPlayer = this.players[i];
                  var currCard = this.deck.cards.splice(0,1)[0];
                  currPlayer.hand.push(currCard);
              }
          }

          // Reset each players turn so that in the new hand, they will
          // get a turn. Then set the first players turn to true to start
          // the hand.
          this.resetPlayerTurns();
          this.players[this.playerTurnIndex].turn = true;
      }
  }

  /**
   * Goes through the players list and sets the turn flag
   * to false. Meaning that for the next round that player
   * hasn't had their turn yet.
   */
  resetPlayerTurns() {
      this.playerTurnIndex = this.players.length-1;
      for (var index = 0; index < this.players.length; index++) {
          var player = this.players[index];
          player.turn = false;
      }
  }

}// End GamePage
