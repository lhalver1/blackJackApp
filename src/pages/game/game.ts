import { Hand } from '../../models/hand';
import { Component, trigger, state, style, transition, animate, keyframes } from '@angular/core';

import { NavController, NavParams, ToastController, Platform } from 'ionic-angular';
import { SQLite } from "ionic-native";

import { ToastProvider } from '../../providers/toast-provider';
import { SettingsProvider } from '../../providers/settings-provider';
import { PlayerProvider } from '../../providers/player-provider';

import { Player } from '../../models/player';
import { Card } from '../../models/card';
import { Deck } from '../../models/deck';
import { Chip } from '../../models/chip'; 
import { Pot } from '../../models/pot'; 
import { MoneyChange } from '../../models/moneyChange'; 
import { Settings } from '../../models/settings';

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
            // transition('void => *', [
            //   style({transform: 'translateY(100%)'}),
            //   animate('500ms cubic-bezier(0.4, 0.0, 0.2, 1);')
            // ]),
            transition('* => void', [
              animate('500ms 400ms cubic-bezier(0.4, 0.0, 0.2, 1)', style({transform: 'translateY(100px)'}))
            ])
          ])
    ]
})
export class GamePage {
    database: SQLite;
    loading: boolean;
    playerTurnIndex: number;
    players: Player[];
    winningPlayers: Player[];
    winnerStr: string;
    deck: Deck;
    trash: Card[];
    pot: Pot;
    playerMoneyChange: MoneyChange;
    potTotal: number;
    settings: Settings;
    roundOver: boolean;

    constructor(public navCtrl: NavController,
        public navParams: NavParams,
        private toastProvider: ToastProvider,
        private platform: Platform,
        public settingsProvider: SettingsProvider,
        public playerProvider: PlayerProvider
        ) {
    // constructor(public navCtrl: NavController, public navParams: NavParams, private toastCtrl: ToastController, private platform: Platform) {
        this.players = [
            new Player(-1, "Dealer", [ new Hand([]) ], 2000, false, "CPU", 0, 0)
        ];
        this.platform.ready().then(() => {
            debugger;
            this.database = new SQLite();
            this.database.openDatabase({name: "blackJackDB.db", location: "default"}).then(() => {
                debugger;
                // this.getAllPlayers(); //Get the player from the database
                this.playerProvider.getPlayer().then((player) => {
                    this.players.push( new Player(player.id, player.name, [ new Hand([]) ], player.money, false, "Human", 0, 0) );
                    this.settingsProvider.getSettings(this.players[1]).then((settings) => {
                        this.settings = settings;
                    }, (error) => {
                        console.log("ERROR in store.ts with getting player: ", error);
                    });
                }, (error) => {
                    console.log("ERROR in store.ts with getting player: ", error);
                });

            }, (error) => {
                console.log("ERROR: ", error);
            });
        });

        debugger;
        this.winningPlayers = [];
        this.winnerStr = "";
        this.trash = [];
        this.pot = new Pot();
        this.potTotal = 0;
        this.roundOver = true;
        this.playerMoneyChange = new MoneyChange('up', 0, false);
        // this.settings = this.service.getSettings();

        // Get the deck of cards
        this.deck = new Deck();
        this.deck.buildDeck()
        this.deck.shuffle();

    }

    ngAfterViewInit() {
    }

    dealOneCard(player: Player, hand: Hand) {
        // if (player.type === "Human" && player.hands.length === 1 && player.hands[0].cards.length === 1) {
        //     let currPlayersCard: Card = player.hands[0].cards[0];
        //     for (var deckIndex = 0; deckIndex < this.deck.cards.length; deckIndex++) {
        //         var currDeckCard = this.deck.cards[deckIndex];
        //         if (currDeckCard.value === currPlayersCard.value) {
        //             let currCard = this.deck.cards.splice(deckIndex, 1)[0];
        //             hand.cards.push(currCard);
        //             break;
        //         }
        //     }
        // } else {
            let currCard = this.deck.cards.splice(0, 1)[0];
            hand.cards.push(currCard);
        // }
    }

    /**
     * Deals out cards to the player and the dealer. First makes sure the
     * gaming flag is set and that both hands are empty, if not then it 
     * puts the cards in the hands in the trash pile.
     */
    dealOutCards() {
        this.roundOver = false;
        this.playerMoneyChange.show = false;

        this.playerProvider.updatePlayer(this.players[1]).then((player) => {
            console.log("Player UPDATED: " + player);
        }, (error) => {
            console.log("ERROR in store.ts with getting perchases");
        }); // update the user

        // Pass out cards to each player, each player gets 1 card
        // then each player gets their 2nd card.
        this.players[0].hands = [ new Hand([]) ];
        this.players[1].hands = [ new Hand([]) ];
        for (var x = 0; x < 2; x++) {
            for (var i = this.players.length - 1; i >= 0; i--) {
                var currPlayer = this.players[i];
                this.dealOneCard(currPlayer, currPlayer.hands[0]);

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
        var total = player.hands[0].handTotal();
        var bustedPlayers = [];

        for (var index = 0; index < this.players.length; index++) {
            let currPlayer: Player = this.players[index];

            if (currPlayer != player) {
                if (currPlayer.turn) {
                    let timesBusted = 0;
                    for (var j = 0; j < currPlayer.hands.length; j++) {
                        var currHand = currPlayer.hands[j];
                        if (currHand.handTotal() > 21) {
                            timesBusted += 1;
                        }
                    }
                    if (timesBusted === currPlayer.hands.length) {
                        bustedPlayers.push(currPlayer);
                    }
                }
            }

        }

        let playersTogoYet = 0;
        for (var index = this.players.length - 1; index >= 0 ; index--) {
            let currPlayer: Player = this.players[index];
            if (currPlayer === player) {
                break;
            } else if(!player.turn) {
                playersTogoYet += 1;
            }
        }

        if (total === 21) {
            setTimeout(() => {
                this.stay(player);
            }, 2000);
        } else if (bustedPlayers.length > 0) {
            setTimeout(() => {
                this.stay(player);
            }, 2000);
        } else if (total <= 16 && bustedPlayers.length <= 0) {
            setTimeout(() => {
                this.hit(player);
            }, 2000);
        } else if (total > 16 && bustedPlayers.length <= 0) {
            setTimeout(() => {
                this.stay(player);
            }, 2000);
        }
    }

    /**
     * Adds a card to the players hand, if the players hand excedes
     * 21 then the player ends their turn and loses and the hand.
     */
    hit(player: Player) {
        player.hands[player.handIndex].cards.push(this.deck.cards.splice(0, 1)[0]);

        if (player.type === "Human") {
            if (player.hands[player.handIndex].handTotal() >= 22) {
                player.handIndex += 1;//Next Hand

                //Does the player have another hand to play?
                if (player.handIndex >= player.hands.length) {
                    this.playerTurnIndex -= 1;//Nope next player
                }

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
        player.handIndex += 1;//Next hand

        //Is there another hand to play?
        if (player.handIndex >= player.hands.length) {
            this.playerTurnIndex -= 1;//Nope, next player
        }

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
     * The player has elected to stay with their hand. End
     * their turn.
     */
    split(player: Player) {
        let card: Card = player.hands[0].cards.splice(0, 1)[0]; // Takes the bottom card from hand
        let newHand: Hand = new Hand( [card] );
        player.hands.push(newHand);

        setTimeout(() => {

            this.dealOneCard(player, player.hands[0]);

            setTimeout(() => {
                this.dealOneCard(player, player.hands[1]);
                // Double the users bet
                let splitBet: Chip[] = [];
                for (var index = 0; index < player.bet.length; index++) {
                    var currChip = player.bet[index];
                    let newChip: Chip = new Chip(currChip.value, currChip.owner);
                    splitBet.push(newChip);
                }
                for (var j = 0; j < splitBet.length; j++) {
                    let currChip: Chip = splitBet[j];
                    player.bet.push(currChip);

                    this.pot.addPlayerChip(currChip);
                    this.pot.addDealerChip(new Chip(currChip.value, this.players[0]));
                    this.potTotal = this.pot.total;

                    player.subtractMoney(currChip.value);
                    this.playerMoneyChange.lose(currChip.value);
                    this.playerMoneyChange.show;
                }
        
                player.handIndex = 0;
            }, 500);

        }, 500);
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
            this.players[1].bet.push(userChip);
            this.playerMoneyChange.lose(amount);
            this.playerMoneyChange.show = true;
            setTimeout(() => {
                this.playerMoneyChange.show = false;
            }, 2000);
    
            let dealerChip: Chip = new Chip(amount, this.players[0]); // Dealer always matches and never runs out of funds
    
            this.pot.addPlayerChip(userChip);
            this.pot.addDealerChip(dealerChip);
            this.potTotal = this.pot.total;
        } else {
            this.toastProvider.showToast('Not Enough Funds!', 3000, 'bottom', 'toastDanger');
        }
    }

    /**
     * Takes the pot total and divids it by 2 because dealer and user both put money in
     * and then adds it back to the users money and clears the pot.
     * 
     * @returns void
     */
    cancelBet(): void {
        this.players[1].addMoney(this.potTotal/2);
        this.pot.clearPot();
        this.potTotal = this.pot.total;
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
            this.winnerStr = '';
            this.playerMoneyChange.show = false;
            this.players[1].bet.splice(0, this.players[1].bet.length);
            this.pot.clearPot();
            this.potTotal = this.pot.total;

            // If there are 12 or less cards remaining do a reshuffle.
            if (this.deck.cards.length <= 12) {
                this.deck.buildDeck();
                this.toastProvider.showToast("Shuffling Deck", 1000, 'bottom', 'toastInfo');
            }

            // Take each players cards and push them to the trash and then
            // clear the players hand.
            for (var i = 0; i < this.players.length; i++) {
                var currPlayer = this.players[i];
                for (var j = 0; j < currPlayer.hands.length; j++) {
                    var currHand = currPlayer.hands[j];
                    if (currHand.cards.length > 0) {
                        for (var index = 0; index < currHand.cards.length; index++) {
                            var currCard = currHand.cards[index];
                            this.trash.push(currCard);
                        }
                        currHand.cards.splice(0, currHand.cards.length);// = [];
                    }
                }
                currPlayer.hands.splice(0, currPlayer.hands.length);
                
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
        let userSplit = false;
        let handsWon = 0;
        let handsPush = 0;

        if (this.players[1].hands.length === 2) {
            userSplit = true;
        }
        
        if (!userSplit) {
            for (var index = 0; index < this.players.length; index++) {
                let currPlayer: Player = this.players[index];
                    
                    for (var j = 0; j < currPlayer.hands.length; j++) {
                        var currHand = currPlayer.hands[j];
                        
                        let currPlayersTotal = currHand.handTotal();
                        if (currPlayersTotal > highestTotal && currPlayersTotal <= 21) {
                            for (var j = 0; j < this.winningPlayers.length; j++) {
                                var currWinner = this.winningPlayers[j];
                                currWinner.hands[0].won = false;
                                currWinner.hands[0].push = false;
                            }
                            this.winningPlayers.splice(0, this.winningPlayers.length);
                            this.winningPlayers.push(currPlayer);
                            currHand.won = true;
                            highestTotal = currPlayersTotal;
                        } else if (currPlayersTotal === highestTotal) {
                            for (var j = 0; j < this.winningPlayers.length; j++) {
                                var currWinner = this.winningPlayers[j];
                                currWinner.hands[0].won = false;
                                currWinner.hands[0].push = true;
                            }
                            this.winningPlayers.push(currPlayer);
                            currHand.push = true;
                        }
                    }
            }
        } else {//user split
            let dealerTotal = this.players[0].hands[0].handTotal();
            for (var k = 0; k < this.players[1].hands.length; k++) {
                var currPlayersHand = this.players[1].hands[k];
                if(currPlayersHand.handTotal() <= 21 && dealerTotal > 21) {
                    handsWon += 1;
                    currPlayersHand.won = true;
                } else if (currPlayersHand.handTotal() <= 21 && currPlayersHand.handTotal() > dealerTotal) {
                    handsWon += 1;
                    currPlayersHand.won = true;
                } else if( currPlayersHand.handTotal() <= 21 && currPlayersHand.handTotal() === dealerTotal) {
                    handsPush += 1;
                    this.players[0].hands[0].push = true;
                    currPlayersHand.push = true;
                }
            }
            if (handsWon > 0 && handsPush === 0) {
                this.winningPlayers.push(this.players[1]);
            } else if(handsPush > 0 && handsWon > 0) {
                this.winningPlayers.push(this.players[0]);
                this.winningPlayers.push(this.players[1]);
            } else if(handsPush > 0 && handsWon === 0) {
                this.winningPlayers.push(this.players[0]);
                this.winningPlayers.push(this.players[1]);
            } else {
                this.winningPlayers.push(this.players[0]);
                this.players[0].hands[0].won = true;
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

        let usersChipTotal = this.pot.playersBet.total;

        let weHaveAWinner = false;
        if (this.winningPlayers.length === 1) {
            if (this.winningPlayers[0].type === 'Human'
                && this.winningPlayers[0].hands.length === 1
                && this.winningPlayers[0].hands[0].cards.length === 2
                && this.winningPlayers[0].hands[0].handTotal() === 21) {

                    this.winningPlayers[0].addMoney(this.potTotal + (this.potTotal/4)); // User gets 50% bonus on their bet for getting BlackJack! potTotal/2 = User bet, potTotal/4 = 50% User bet
                    this.playerMoneyChange.gain(this.potTotal + (this.potTotal/4));
                    weHaveAWinner = true;
                    this.winnerStr = 'userWins';

            } else if(userSplit && this.winningPlayers[0].type === 'Human') {
                let usersBet =  this.pot.playersBet.total; //this.getPlayersBetInfo().playerBetTotal;
                let betPerHand = usersBet / 2;
                if ( (handsWon === 1 && handsPush === 0) || (handsPush === 2) ) {
                    this.winningPlayers[0].addMoney(betPerHand * 2);
                    this.playerMoneyChange.gain(betPerHand * 2);
                    weHaveAWinner = true;
                    this.winnerStr = 'userWins';
                } else if (handsWon === 1 && handsPush === 1) {
                    this.winningPlayers[0].addMoney( (betPerHand) + (betPerHand*2) ); // user gets half their bet back
                    this.playerMoneyChange.gain( (betPerHand) + (betPerHand*2) );
                    weHaveAWinner = true;
                    this.winnerStr = 'userWins';
                } else if(handsWon === 2) {
                    this.winningPlayers[0].addMoney(this.potTotal);
                    this.playerMoneyChange.gain( this.potTotal );
                    weHaveAWinner = true;
                    this.winnerStr = 'userWins';
                }
            } else {
                this.winningPlayers[0].addMoney(this.potTotal);
                if (this.winningPlayers[0].type === 'Human') {
                    this.playerMoneyChange.gain(this.potTotal);
                    weHaveAWinner = true;
                    this.winnerStr = 'userWins';
                } else {
                    this.winnerStr = 'dealerWins';
                }
            }
        } else {
            let usersBet = this.pot.playersBet.total; //this.getPlayersBetInfo().playerBetTotal;
            if (!userSplit || handsPush === 2) {
                // It was a push since the dealer and user both won
                this.players[1].addMoney(usersChipTotal);
                this.playerMoneyChange.gain(usersChipTotal);
            } else if(userSplit && handsWon === 1 && handsPush === 1) {
                let betPerHand = usersBet / 2;
                this.winningPlayers[0].addMoney( (betPerHand) + (betPerHand*2) ); // user gets half their bet back
                this.playerMoneyChange.gain( (betPerHand) + (betPerHand*2) );
            } else if(handsPush === 1) {
                this.players[1].addMoney(usersChipTotal / 2);
                this.playerMoneyChange.gain(usersChipTotal / 2);
            }
            weHaveAWinner = true;
            this.winnerStr = 'userWins';
            
        }

        if (weHaveAWinner) {
            this.playerMoneyChange.show = true;
        }
        
        this.playerProvider.updatePlayer(this.players[1]).then((player) => {
            console.log("Player UPDATED: " + player);
        }, (error) => {
            console.log("ERROR in store.ts with getting perchases");
        });
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

    hasSplit(player: Player) {
        if (typeof player.hands[0].cards[0] != 'undefined' && typeof player.hands[0].cards[1] != 'undefined') {
                if (player.hands[0].cards[0].value === player.hands[0].cards[1].value && player.hands.length === 1
                    && player.hands[0].cards.length === 2) {
                        return true;
                } else {
                        return false;
                }
        }
        
    }

    // getPlayersBetInfo() {
    //     let dataObj = {
    //         playerBetTotal: 0,
    //         playersChips: []
    //     };
    //     for (var index = 0; index < this.pot.length; index++) {
    //         var currChip = this.pot[index];
    //         if (currChip.owner === this.players[1]) {
    //             dataObj.playersChips.push(currChip);
    //             dataObj.playerBetTotal += currChip.value;
    //         }
    //     }
    //     return dataObj;
    // }

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
            player.handIndex = 0;
        }
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

    // ionViewWillLeave() {
    //     if (this.database) {
    //         this.database.close();
    //     }
    // }



    // DATABASE CRUDs
    // getAllPlayers() {
    //     debugger;
    //     this.database.executeSql("SELECT * FROM players", []).then((data) => {
    //         if(data.rows.length > 0) {
    //             for(var i = 0; i < data.rows.length; i++) {
    //                 let newPlayer = new Player(data.rows.item(i).id, data.rows.item(i).name, [], data.rows.item(i).money, false, "Human", 0, 0);
    //                 this.players.push( newPlayer );

    //                 this.database.executeSql("SELECT * FROM store", []).then((data) => {
    //                     let playerIsIn: boolean = false;
    //                     if(data.rows.length > 0) {
    //                         for(var i = 0; i < data.rows.length; i++) {
    //                             debugger;
    //                             let playerRowId = data.rows.item(i).player_id;
    //                             if (playerRowId === newPlayer.id) {
    //                                 // Player is in there do nothing
    //                                 playerIsIn = true;
    //                                 break;
    //                             }
    //                         }
    //                     } else {
    //                         playerIsIn = false;
    //                     }

    //                     if (!playerIsIn) {
    //                         this.addStoreRow(newPlayer);
    //                     } else {
    //                         //Player is all set up lets get the game going
                            
    //                     }
    //                 }, (error) => {
    //                     console.log("ERROR: " + JSON.stringify(error));
    //                 });

    //             }
    //         } else {
    //             let newPlayer = new Player(-1, "Player", [], 2000, false, "Human", 0, 0);
    //             this.addPlayer(newPlayer);
    //         }
    //     }, (error) => {
    //         console.log("ERROR: " + JSON.stringify(error));
    //     });
    // }

    // addPlayer(player: Player) {
    //     this.database.executeSql("INSERT INTO players (name, money) VALUES ('"+ player.name +"', "+ player.money +")", []).then((data) => {
    //         console.log("INSERTED into players: " + JSON.stringify(data));
    //         this.getAllPlayers();
    //     }, (error) => {
    //         console.log("ERROR: " + JSON.stringify(error.message));
    //     });
    // }

    // addStoreRow(player: Player) {
    //     this.database.executeSql("INSERT INTO store "+
    //         "(player_id, greenPoker_back, redPoker_back, bluePoker_back, greenFelt_back, spaceNight_back, redDiamonds_cardBack, material_cardFront, classic_cardFront, vegas_chips) " + 
    //         "VALUES ("+ player.id + ", 'false', 'false', 'false', 'true', 'false', 'true', 'true', 'false', 'true')", []).then((data) => {
    //         console.log("INSERTED into store: " + JSON.stringify(data));
    //         this.getAllPlayers();
    //     }, (error) => {
    //         console.log("ERROR: " + JSON.stringify(error.message));
    //     });
    // }

    // updatePlayer(player: Player) {
    //     this.database.executeSql("UPDATE players SET name = '"+ player.name +"', money = "+ player.money +" WHERE id = "+ player.id +"", []).then((data) => {
    //         console.log("UPDATED: " + JSON.stringify(data));
    //     }, (error) => {
    //         console.log("ERROR: " + JSON.stringify(error.message));
    //     });
    // }

}// End GamePage
