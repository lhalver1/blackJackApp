export class MoneyChange {
    public direction: string;
    public amount: number;
    public show: boolean;

    constructor(direction: string, amount: number, show: boolean) {
        this.direction = direction;
        this.amount = amount;
        this.show = show;
    }

    lose(amount: number) {
        this.amount = amount;
        this.direction = 'down';
    }
    gain(amount: number) {
        this.amount = amount;
        this.direction = 'up';
    }
}