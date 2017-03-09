export class Settings {
    public cpuDecisionTime: number;
    public percent: boolean;
    public record: boolean;
    public selectedBackground: string;
    public selectedCardBack: string;
    public selectedCardFront: string;
    public chips: string;

    constructor(time: number, showPercent: boolean, showRecord: boolean, selectedBackground: string, selectedCardBack: string, selectedCardFront: string, chips: string) {
        this.cpuDecisionTime = time;
        this.percent = showPercent;
        this.record = showRecord;
        this.selectedBackground = selectedBackground;
        this.selectedCardBack = selectedCardBack;
        this.selectedCardFront = selectedCardFront;
        this.chips = chips;
    }

    getBackgroundPath() {
        switch (this.selectedBackground) {
            case 'greenPoker':
                return 'assets/img/backgrounds/greenPoker.png'
            case 'redPoker':
                return 'assets/img/backgrounds/redPoker.png'
            case 'bluePoker':
                return 'assets/img/backgrounds/bluePoker.png'
            case 'greenFelt':
                return 'assets/img/backgrounds/greenFelt.png'
            case 'spaceNight':
                return 'assets/img/backgrounds/space_night.jpg'
            case 'spacePlanet':
                return 'assets/img/space_planet.jpg'
        
            default:
                return 'assets/img/tableBackground.png';
        }
    }

    getCardBackPath() {
        switch (this.selectedCardBack) {
            case 'redDiamonds':
                return 'assets/img/cardBacks/redDiamonds.png';
        
            default:
                return 'assets/img/cardBack.png';
        }
    }

    getCardFrontPath() {
        switch (this.selectedCardFront) {
            case 'material':
                return 'assets/img/cardImages/material/';
            case 'classic':
                return 'assets/img/cardImages/classic/';
        
            default:
                return 'assets/img/cardImages/material/';
        }
    }
}