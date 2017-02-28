import { Card } from './card';
import { Hand } from './hand';
import { Chip } from './chip';

export class Player {
    public id: number;
    public name: string;
    public hands: Hand[];
    public handIndex: number;
    public money: number;
    public bet: Chip[];
    public turn: boolean;
    public type: string;
    public wins: number;
    public losses: number;

    constructor(id: number, name: string, hands: Hand[], money: number,turn: boolean, type: string, wins: number, losses: number) {
        this.id = id;
        this.name = name;
        this.hands = hands;
        this.money = money;
        this.turn = turn;
        this.type = type;
        this.wins = wins;
        this.losses = losses;

        this.handIndex = 0;
        this.bet = [];
    }

    /**
     * Counts the cards sum in the players hand.
     * 
     * @returns {int} total - The sum of the players cards
     */
    // cardsTotal() {
    //     var acesArr = [];
    //     var total = 0;
    //     for (var index = 0; index < this.hands.length; index++) {
    //         var currHand = this.hands[index];
            
    //         for (var i = 0; i < currHand.cards.length; i++) {
    //             var card = currHand.cards[i];
    //             var value = card.value;
    
    //             if(value == "King" || value == "Queen" || value == "Jack") {
    //                 total += 10;
    //             } else if (value == "Ace") {
    //                 total += 11;
    //                 acesArr.push(card);
    //             } else {
    //                 total += parseInt(value);
    //             }
    //         }//END For
    //     }

    //     if (acesArr.length > 0) {
    //         for (var index = 0; index < acesArr.length; index++) {
    //             if (total > 21) {
    //                 total -= 10;
    //             }
    //         }
    //     }

    //     return total;
    // }

    subtractMoney(amount) {
        this.money -= amount;
    }
    addMoney(amount) {
        this.money += amount;
    }
}