import { Card } from './card';

export class Player {
    public name: string;
    public hand: Card[];
    public turn: boolean;
    public type: string;
    public wins: number;
    public losses: number;

    constructor(name: string, hand: Card[], turn: boolean, type: string, wins: number, losses: number) {
        this.name = name;
        this.hand = hand;
        this.turn = turn;
        this.type = type;
        this.wins = wins;
        this.losses = losses;
    }

    /**
     * Counts the cards sum in the players hand.
     * 
     * @returns {int} total - The sum of the players cards
     */
    cardsTotal() {
        var acesArr = [];
        var total = 0;

        for (var i = 0; i < this.hand.length; i++) {
            var card = this.hand[i];
            var value = card.value;

            if(value == "King" || value == "Queen" || value == "Jack") {
                total += 10;
            } else if (value == "Ace") {
                total += 11;
                acesArr.push(card);
            } else {
                total += parseInt(value);
            }
        }//END For

        if (acesArr.length > 0) {
            for (var index = 0; index < acesArr.length; index++) {
                if (total > 21) {
                    total -= 10;
                }
            }
        }

        return total;
    }
}