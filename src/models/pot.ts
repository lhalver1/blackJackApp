import { Chip } from './chip';

class PlayerBet {
    public total: number;
    public chips: Chip[];

    constructor(){
        this.total = 0;
        this.chips = [];
    }
}

export class Pot {
    public chips: Chip[];
    public total: number;
    public playersBet: PlayerBet;
    public dealersBet: PlayerBet;

    constructor() {
        this.chips = [];
        this.total = 0;
        this.playersBet = new PlayerBet();
        this.dealersBet = new PlayerBet();
    }

    addDealerChip(chip: Chip): void {
        this.chips.push(chip);
        this.dealersBet.chips.push(chip);
        this.dealersBet.total = this.getDealersTotal();
        this.total = this.getTotal();
    }

    addPlayerChip(chip: Chip): void {
        this.chips.push(chip);
        this.playersBet.chips.push(chip);
        this.playersBet.total = this.getPlayersTotal();
        this.total = this.getTotal();
    }

    getTotal(): number {
        let total = 0;
        for (var index = 0; index < this.chips.length; index++) {
            var currChip = this.chips[index];
            total += currChip.value;
        }
        return total;
    }

    getDealersTotal(): number {
        let dealersTotal: number = 0;
        for (var index = 0; index < this.dealersBet.chips.length; index++) {
            var currDealersChip = this.dealersBet.chips[index];
            dealersTotal += currDealersChip.value;
        }
        return dealersTotal;
    }

    getPlayersTotal(): number {
        let playersTotal: number = 0;
        for (var index = 0; index < this.playersBet.chips.length; index++) {
            var currPlayersChip = this.playersBet.chips[index];
            playersTotal += currPlayersChip.value;
        }
        return playersTotal;
    }

    getPlayersChipsPerHand(): Chip[] {
        let chips: Chip[] = [];
        for (var index = 0; index < this.playersBet.chips.length/2; index++) {
            var currPlayersChip = this.playersBet[index];
            chips.push(currPlayersChip);
        }
        return chips;
    }

    clearPot() {
        this.chips = [];
        this.total = 0;
        this.playersBet = new PlayerBet();
        this.dealersBet = new PlayerBet();
    }
}