import { Card } from './card';

export class Deck {
    public cards: Card[];

    constructor() {
        this.cards = [];
    }

    /**
     * Builds the deck of cards. Creates an array of card objects with a
     * suit and value property.
     */
    buildDeck(): void {
        if (this.cards.length > 0) {
            this.cards = [];
        }
        let suits = ["Hearts", "Diamonds", "Spades", "Clubs"];
        let cards = ["Ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "Jack", "Queen", "King"];

        for(var i = 0; i < suits.length ; i++) {
            var currSuit = suits[i];
            for(var k = 0; k < cards.length ; k++) {
                var currCard = cards[k];
                this.cards.push( new Card(currSuit, currCard) );
            }
        }

        //Be sure to shuffle it
        this.shuffle();
    }

    /**
     * Randomly shuffle the items in an array, work up the array
     * of cards and grab a random index that is up in the array
     * and swap the card at the random index with the card at the
     * current index.
     */
    shuffle() {

        for (var index = 0; index < this.cards.length; index++) {
            let currCard: Card = this.cards[index];
            let randomIndex: number = Math.floor(Math.random() * index);

            this.cards[index] = this.cards[randomIndex];
            this.cards[randomIndex] = currCard;
            
        }
    }
}