export class Settings {
    public cpuDecisionTime: number;
    public percent: boolean;
    public record: boolean;

    constructor(time: number, showPercent: boolean, showRecord: boolean) {
        this.cpuDecisionTime = time;
        this.percent = showPercent;
        this.record = showRecord;
    }
}