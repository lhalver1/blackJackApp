import { estimateHeight } from 'ionic-angular/es2015/components/virtual-scroll/virtual-util';
import { Component, trigger, state, style, transition, animate, group } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { Player } from '../../models/player';
import { Card } from '../../models/card';
import { Deck } from '../../models/deck';
import { Settings } from '../../models/settings';

declare let $: any;          //Jquery

@Component({
    selector: 'game-page',
    templateUrl: 'game.html',
    animations: [
        trigger('winnerState', [
            state('*', style({
                visibility: 'hidden',
                overflow: 'hidden',
                height: 0
            })),
            state('show', style({
                visibility: 'visible',
                overflow: 'hidden',
                height: '*'
            })),
            transition('* => show', animate('400ms ease-in')),
            transition('show => *', animate('400ms ease-out'))
        ]),
        trigger('slideIn', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => *', [
              style({transform: 'translateX(100%)'}),
              animate(400)
            ])//,
            // transition('* => void', [
            //   animate(400, style({transform: 'translateX(-100%)'}))
            // ])
        ])
    ]
})
export class GamePage {
    showWinners: string;
    playerTurnIndex: number;
    players: Player[];
    winningPlayers: Player[];
    deck: Deck;
    trash: Card[];
    settings: Settings;

    constructor(public navCtrl: NavController, public navParams: NavParams) {
        this.showWinners = 'hide';
        // Get the players
        this.players = [
            new Player("Dealer", [], false, "CPU", 0, 0),
            new Player("Jalen", [], false, "CPU", 0, 0),
            new Player("Logan", [], false, "Human", 0, 0)
        ];
        this.winningPlayers = [];
        this.trash = [];
        this.settings = new Settings(2000, false, false);

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
        }

        // Pass out cards to each player, each player gets 1 card
        // then each player gets their 2nd card.
        for (var x = 0; x < 2; x++) {
            for (var i = 0; i < this.players.length; i++) {
                var currPlayer = this.players[i];
                var currCard = this.deck.cards.splice(0, 1)[0];
                currPlayer.hand.push(currCard);
            }
        }

        // Reset each players turn so that in the new hand, they will
        // get a turn. Then set the first players turn to true to start
        // the hand.
        this.resetPlayerTurns();
        this.players[this.playerTurnIndex].turn = true;
    }

    /**
     * The next player is a Bot or Dealer, be smart for them.
     */
    goBeABot(player: Player) {
        // debugger;
        var total = player.cardsTotal();
        var bustedPlayers = [];
        var highestVisibleTotal = -1;
        var thisPlayersRealLifeIndex = -1;

        for (var index = 0; index < this.players.length; index++) {
            let currPlayer: Player = this.players[index];

            if (currPlayer != player) {
                var playersTotal = currPlayer.cardsTotal();
                if (currPlayer.turn || playersTotal === 21) {

                    if (playersTotal > 21) {
                        bustedPlayers.push(currPlayer);
                    } else if (playersTotal > highestVisibleTotal) {
                        highestVisibleTotal = playersTotal;
                    }
                }
            } else {
                thisPlayersRealLifeIndex = index + 1;
            }

        }

        let playersTogoYet = 0;
        for (var index = 0; index < this.players.length; index++) {
            let currPlayer: Player = this.players[index];
            if (currPlayer === player) {
                break;
            } else {
                playersTogoYet += 1;
            }
        }

        // var remainingPlayersThatHaventBusted = ($scope.players.length-1) - bustedPlayers.length;
        let thisPlayersArrayIndex = thisPlayersRealLifeIndex - 1;

        // var playersInfrontOfMeThatHaventBusted = thisPlayersArrayIndex - bustedPlayers.length;
        var numPlayersBehindMe = this.players.length - thisPlayersArrayIndex;
        if (total === 21) {
            setTimeout(() => {
                this.stay(player);
            }, this.settings.cpuDecisionTime);
        } else if (total <= 16 && playersTogoYet > 0 && highestVisibleTotal > total) {
            setTimeout(() => {
                this.hit(player);
            }, this.settings.cpuDecisionTime);
        } else if (total <= 16 && playersTogoYet === 0 && highestVisibleTotal <= total) {
            setTimeout(() => {
                this.stay(player);
            }, this.settings.cpuDecisionTime);
        } else if (total > 16 && playersTogoYet > 0 && highestVisibleTotal <= total) {
            setTimeout(() => {
                this.stay(player);
            }, this.settings.cpuDecisionTime);
        } else if (total > 16 && playersTogoYet === 0 && highestVisibleTotal > total) {
            setTimeout(() => {
                this.hit(player);
            }, this.settings.cpuDecisionTime);
        } else if (total <= 16 && playersTogoYet > 0 && highestVisibleTotal <= total) {
            setTimeout(() => {
                this.hit(player);
            }, this.settings.cpuDecisionTime);
        } else if (total <= 16 && playersTogoYet === 0 && highestVisibleTotal > total) {
            setTimeout(() => {
                this.hit(player);
            }, this.settings.cpuDecisionTime);
        } else if (total > 16 && playersTogoYet > 0 && highestVisibleTotal > total) {
            setTimeout(() => {
                this.hit(player);
            }, this.settings.cpuDecisionTime);
        } else if (total > 16 && playersTogoYet === 0 && highestVisibleTotal <= total) {
            setTimeout(() => {
                this.stay(player);
            }, this.settings.cpuDecisionTime);
        }
    }

    /**
     * Adds a card to the players hand, if the players hand excedes
     * 21 then the player ends their turn and loses and the hand.
     */
    hit(player: Player) {
        // debugger;
        player.hand.push(this.deck.cards.splice(0, 1)[0]);

        if (player.type === "Human") {
            if (player.cardsTotal() >= 22) {
                this.playerTurnIndex -= 1;

                //If the next players turn is out of index for players array
                //Reset it back to the beginning
                if (this.playerTurnIndex < 0) {

                    this.endRound();

                } else {
                    var nextPlayer = this.players[this.playerTurnIndex];
                    nextPlayer.turn = true;
                    if (nextPlayer.type == "CPU") {
                        this.goBeABot(nextPlayer);
                    }
                }
            }
        } else {
            this.goBeABot(player);
        }

    }

    /**
     * The player has elected to stay with their hand. End
     * their turn.
     */
    stay(player: Player) {
        // debugger;
        this.playerTurnIndex -= 1;

        //If the next players turn is out of index for players array
        //Reset it back to the beginning
        if (this.playerTurnIndex < 0) {

            this.endRound();

        } else {
            let nextPlayer: Player = this.players[this.playerTurnIndex];
            nextPlayer.turn = true;
            if (nextPlayer.type == "CPU") {
                this.goBeABot(nextPlayer);
            }
        }
    }

    /**
     * The ends the current round by determining a winner and 
     * then after 4sec dealing out new cards.
     */
    endRound() {
        this.determineWinner();
        this.showWinners = 'show';
        setTimeout(() => {
            this.showWinners = 'hide';
            this.winningPlayers.splice(0, this.winningPlayers.length);  
            this.dealOutCards();
        }, 4000);
    }

    /**
     * This determines the winner for the round.
     */
    determineWinner() {
        this.winningPlayers.splice(0, this.winningPlayers.length);// = [];
        let highestTotal = -1;

        for (var index = 0; index < this.players.length; index++) {
            let currPlayer: Player = this.players[index];
            let currPlayersTotal = currPlayer.cardsTotal();

            if (currPlayersTotal > highestTotal && currPlayersTotal <= 21) {
                this.winningPlayers.splice(0, this.winningPlayers.length);
                this.winningPlayers.push(currPlayer);
                highestTotal = currPlayersTotal;
            } else if (currPlayersTotal === highestTotal) {
                this.winningPlayers.push(currPlayer);
            }
        }

        for (var i = 0; i < this.players.length; i++) {
            var currPlayer: Player = this.players[i];
            var isWinner = false;

            for (var j = 0; j < this.winningPlayers.length; j++) {
                var currWinner = this.winningPlayers[j];
                if (currWinner == currPlayer) {
                    currPlayer.wins += 1;
                    isWinner = true;
                }
            }//End winners for
            if (!isWinner) {
                currPlayer.losses += 1;
            }
        }//End players for
    }

    /**
     * Goes through the players list and sets the turn flag
     * to false. Meaning that for the next round that player
     * hasn't had their turn yet.
     */
    resetPlayerTurns() {
        this.playerTurnIndex = this.players.length - 1;
        for (var index = 0; index < this.players.length; index++) {
            var player = this.players[index];
            player.turn = false;
        }
    }

}// End GamePage
