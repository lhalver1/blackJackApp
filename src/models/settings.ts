export class Settings {
    public cpuDecisionTime: number;
    public percent: boolean;
    public record: boolean;
    public selectedBackground: string;
    public selectedCardBack: string;
    public selectedCardFront: string;

    constructor(time: number, showPercent: boolean, showRecord: boolean, selectedBackground: string, selectedCardBack: string, selectedCardFront: string) {
        this.cpuDecisionTime = time;
        this.percent = showPercent;
        this.record = showRecord;
        this.selectedBackground = selectedBackground;
        this.selectedCardBack = selectedCardBack;
        this.selectedCardFront = selectedCardFront;
    }

    getBackgroundPath() {
        switch (this.selectedBackground) {
            case 'greenPoker':
                return 'assets/img/tableBackground.png'
            case 'greenFelt':
                return 'assets/img/background.png'
            case 'materialGreen':
                return 'assets/img/materialBackground.png'
        
            default:
                return 'assets/img/tableBackground.png';
        }
    }

    getCardBackPath() {
        switch (this.selectedCardBack) {
            case 'redDiamonds':
                return 'assets/img/cardBack.png';
        
            default:
                return 'assets/img/cardBack.png';
        }
    }

    getCardFrontPath() {
        switch (this.selectedCardFront) {
            case 'material':
                return 'assets/img/cardImages/';
        
            default:
                return 'assets/img/cardImages/';
        }
    }
}