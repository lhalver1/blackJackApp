import { Player } from './player';

export class Chip {
    public value: string;
    public owner: Player;

    constructor(value: string, owner: Player) {
        this.value = value;
        this.owner = owner;
    }
}