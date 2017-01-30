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
     * Randomly shuffle the items in an array
     * From: http://stackoverflow.com/a/2450976/2593877
     */
    shuffle() {
        var currentIndex = this.cards.length, temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = this.cards[currentIndex];
            this.cards[currentIndex] = this.cards[randomIndex];
            this.cards[randomIndex] = temporaryValue;
        }
    }
}