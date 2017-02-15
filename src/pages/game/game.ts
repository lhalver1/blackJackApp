import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';

import { Player } from '../../models/player';
import { Card } from '../../models/card';
import { Deck } from '../../models/deck';
import { Chip } from '../../models/chip'; 
import { MoneyChange } from '../../models/moneyChange'; 
import { Settings } from '../../models/settings';

declare let $: any;          //Jquery

@Component({
    selector: 'game-page',
    templateUrl: 'game2.html',
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
        trigger('growShrink', [
            state('true', style({
                transform: 'scale(1.3)'
            })),
            state('false', style({
                transform: 'scale(1) translateY(0px)',
            })),
            transition('void => 1', animate('100ms 0.7s ease-in-out')),
            transition('0 => 1', animate('200ms 0.7s ease-in-out')),
            transition('1 => 0', animate('200ms 400ms ease-in-out'))
        ]),
        trigger('topRightFlyIn', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => yes', [
              animate(400, keyframes([
                style({opacity: 0, transform: 'translate(100%, -100%)', offset: 0}),
                // style({opacity: 1, transform: 'translate(-15px, 15px)',  offset: 0.3}),
                style({opacity: 1, transform: 'translate(0, 0)',     offset: 1.0})
              ]))
            ])
        ]),
        trigger('bottomRightFlyIn', [
            state('in', style({transform: 'translateX(0)'})),
            transition('void => yes', [
              animate(400, keyframes([
                style({opacity: 0, transform: 'translate(100%, 100%)', offset: 0}),
                // style({opacity: 1, transform: 'translate(-15px, -15px)',  offset: 0.3}),
                style({opacity: 1, transform: 'translate(0, 0)',     offset: 1.0})
              ]))
            ])
        ]),
        trigger('enterFromBottom', [
            state('in', style({transform: 'translateY(0)'})),
            transition('void => *', [
              style({transform: 'translateY(100%)'}),
              animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1);')
            ]),
            transition('* => void', [
              animate('500ms 400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({transform: 'translateY(100%)'}))
            ])
          ])
    ]
})
export class GamePage {
    playerTurnIndex: number;
    players: Player[];
    winningPlayers: Player[];
    deck: Deck;
    trash: Card[];
    pot: Chip[];
    playerMoneyChange: MoneyChange;
    potTotal: number;
    settings: Settings;
    roundOver: boolean;

    constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController) {
        // Get the players
        this.players = [
            new Player("Dealer", [], 2000,false, "CPU", 0, 0),
            new Player("Logan", [], 2000, false, "Human", 0, 0)
        ];
        this.winningPlayers = [];
        this.trash = [];
        this.pot = [];
        this.potTotal = 0;
        this.roundOver = true;
        this.playerMoneyChange = new MoneyChange('up', 0, false)
        this.settings = new Settings(2000, false, false);

        // Get the deck of cards
        this.deck = new Deck();
        this.deck.buildDeck()
        this.deck.shuffle();

        // this.dealOutCards();
    }

    ngAfterViewInit() {
    }

    /**
     * Deals out cards to the player and the dealer. First makes sure the
     * gaming flag is set and that both hands are empty, if not then it 
     * puts the cards in the hands in the trash pile.
     */
    dealOutCards() {
        this.roundOver = false;
        this.playerMoneyChange.show = false;

        // If there are 12 or less cards remaining do a reshuffle.
        if (this.deck.cards.length <= 12) {
            this.deck.buildDeck();
        }

        // Pass out cards to each player, each player gets 1 card
        // then each player gets their 2nd card.
        for (var x = 0; x < 2; x++) {
            for (var i = this.players.length - 1; i >= 0; i--) {
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
        // let thisPlayersArrayIndex = thisPlayersRealLifeIndex - 1;

        // var playersInfrontOfMeThatHaventBusted = thisPlayersArrayIndex - bustedPlayers.length;
        // var numPlayersBehindMe = this.players.length - thisPlayersArrayIndex;
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
     * Places the bet into the pot
     * 
     * @param  {number} amount - The amount the user has bet
     */
    placeBet(amount: number) {
        if (this.players[1].money >= amount) {
            this.playerMoneyChange.show = false;
            let userChip: Chip = new Chip(amount, this.players[1]);
            this.players[1].subtractMoney(amount);
            this.playerMoneyChange.lose(amount);
            this.playerMoneyChange.show = true;
            setTimeout(() => {
                this.playerMoneyChange.show = false;
            }, 2000);
    
            let dealerChip: Chip = new Chip(amount, this.players[0]); // Dealer always matches and never runs out of funds
    
            this.pot.push(userChip);
            this.pot.push(dealerChip);
            this.potTotal += userChip.value * 2;
        } else {
            this.showToast('Not Enough Funds!', 3000, 'bottom', 'toastDanger');
        }
    }

    /**
     * The ends the current round by determining a winner and 
     * then after 4sec dealing out new cards.
     */
    endRound() {
        this.determineWinner();
        setTimeout(() => {
            this.roundOver = true;
            this.winningPlayers.splice(0, this.winningPlayers.length);
            this.playerMoneyChange.show = false;

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

            this.resetPlayerTurns();

            // this.dealOutCards();
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
                    break;
                }
            }//End winners for
            if (!isWinner) {
                currPlayer.losses += 1;
            }
        }//End players for

        let usersChipTotal = 0;
        let dealersChipTotal = 0;
        for (var index = 0; index < this.pot.length; index++) {
            var chip = this.pot[index];
            switch (chip.owner) {
                case this.players[0]:
                    dealersChipTotal += chip.value;
                    break;
                case this.players[1]:
                    usersChipTotal += chip.value;
                    break;
            
                default:
                    break;
            }
        }

        let weHaveAWinner = false;
        if (this.winningPlayers.length === 1) {
            if (this.winningPlayers[0].type === 'Human' && this.winningPlayers[0].hand.length === 2 && this.winningPlayers[0].cardsTotal() == 21) {
                this.winningPlayers[0].addMoney(this.potTotal + (this.potTotal/4)); // User gets 50% bonus on their bet for getting BlackJack! potTotal/2 = User bet, potTotal/4 = 50% User bet
                this.playerMoneyChange.gain(this.potTotal + (this.potTotal/4));
                weHaveAWinner = true;
            } else {
                this.winningPlayers[0].addMoney(this.potTotal);
                if (this.winningPlayers[0].type === 'Human') {
                    this.playerMoneyChange.gain(this.potTotal);
                    weHaveAWinner = true;
                }
            }
        } else {
            // It was a push since the dealer and user both won
            this.players[1].addMoney(usersChipTotal);
            this.playerMoneyChange.gain(usersChipTotal);
            weHaveAWinner = true;
        }

        if (weHaveAWinner) {
            this.playerMoneyChange.show = true;
        }
        this.pot.splice(0, this.pot.length);
        this.potTotal = 0;
    }

    /**
     * Checks to see if the given player is in the winneingPlayers array,
     * returns true if they are and false if they aren't.
     * 
     * @param  {Player} player - The player to search for in the winningPlayers array
     * @returns boolean - Was the given player found in the array
     */
    isWinner(player: Player): boolean {
        for (let index = 0; index < this.winningPlayers.length; index++) {
            let currWinner = this.winningPlayers[index];
            if (currWinner === player) {
                return true;
            }
        }
        return false;
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

    /**
     * Shows a toast with the given message for the given duration and
     * in the given position.
     * 
     * @param  {string} msg - Message in the toast
     * @param  {number} duration - In milliseconds, the duration of the toast
     * @param  {string} position - 'top', 'bottom', 'middle' position of the toast on the screen
     * @returns void
     */
    showToast(msg: string, duration: number, position: string, cssClass: string): void {
        let toast = this.toastCtrl.create({
        message: msg,
        duration: duration,
        position: position,
        cssClass: cssClass
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }

    calcCardRotation(cardIndex, numCards) {
        switch (numCards) {
            case 2:
                if (cardIndex === 0) {
                    return 'rotate(-5deg)';
                } else {
                    return 'rotate(5deg)';
                }
            case 3:
                if (cardIndex === 0) {
                    return 'rotate(-5deg)';
                } else if(cardIndex === 1) {
                    return 'rotate(0deg)';
                } else {
                    return 'rotate(5deg)';
                }
            case 4:
                if (cardIndex === 0) {
                    return 'rotate(-5deg)';
                } else if(cardIndex === 1) {
                    return 'rotate(0deg)';
                } else if(cardIndex === 2) {
                    return 'rotate(5deg)';
                } else {
                    return 'rotate(10deg)';
                }
            case 5:
                if (cardIndex === 0) {
                    return 'rotate(-10deg)';
                } else if(cardIndex === 1) {
                    return 'rotate(-5deg)';
                } else if(cardIndex === 2) {
                    return 'rotate(0deg)';
                } else if(cardIndex === 3){
                    return 'rotate(5deg)';
                } else {
                    return 'rotate(10deg)';
                }
            case 6:
                if (cardIndex === 0) {
                    return 'rotate(-10deg)';
                } else if(cardIndex === 1) {
                    return 'rotate(-5deg)';
                } else if(cardIndex === 2) {
                    return 'rotate(0deg)';
                } else if(cardIndex === 3) {
                    return 'rotate(5deg)';
                } else if(cardIndex === 4) {
                    return 'rotate(10deg)';
                } else {
                    return 'rotate(15deg)';
                }
        
            default:
                break;
        }
    }

}// End GamePage
