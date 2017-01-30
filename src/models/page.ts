export class Page {
    public title: string;
    public component: any;
    public icon: string;

    constructor(title: string, component: any, icon: string) {
        this.title = title;
        this.component = component;
        this.icon = icon;
    }
}