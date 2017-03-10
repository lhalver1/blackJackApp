import { Player } from './player';

export class Chip {
    public value: number;
    public owner: Player;

    constructor(value: number, owner: Player) {
        this.value = value;
        this.owner = owner;
    }
}