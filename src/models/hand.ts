import { Card } from './card';

export class Hand {
    public cards: Card[];
    public won: boolean;
    public push: boolean;

    constructor(cards: Card[]) {
        this.cards = cards;

        this.won = false;
        this.push = false;
    }

    /**
     * Counts the cards sum in the players hand.
     * 
     * @returns {int} total - The sum of the players cards
     */
    handTotal() {
        var acesArr = [];
        var total = 0;
            
        for (var i = 0; i < this.cards.length; i++) {
            var card = this.cards[i];
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