import { Component } from '@angular/core';
import { Platform, NavController, NavParams, AlertController } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { PlayerProvider } from '../../providers/player-provider';
import { StoreProvider } from '../../providers/store-provider';
import { SettingsProvider } from '../../providers/settings-provider';
import { ToastProvider } from '../../providers/toast-provider';

import { Player } from '../../models/player';

class StoreItem {
    public title: string;
    public path: string;
    public description: string;
    public price: number;
    public name: string;
    public owned: boolean;

    constructor(title: string, path: string, description: string, price: number, name: string, owned: boolean) {
        this.title = title;
        this.path = path;
        this.description = description;
        this.price = price;
        this.name = name;
        this.owned = owned;
    }
}

@Component({
    selector: 'page-store',
    templateUrl: 'store.html'
})
export class StorePage {
    database: SQLite;
    storeDBItem: any;
    player: Player;
    storeFilter: string;
    backgrounds: StoreItem[];
    cardFronts: StoreItem[];
    cardBacks: StoreItem[];
    chips: StoreItem[];

    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        private playerProvider: PlayerProvider,
        private storeProvider: StoreProvider,
        private settingsProvider: SettingsProvider,
        private toastProvider: ToastProvider,
        public alertCtrl: AlertController) {

        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({ name: "blackJackDB.db", location: "default" }).then(() => {
                // console.log("getting purchases store.ts");

                this.playerProvider.getPlayer().then((player) => {
                    this.player = player;
                    this.storeProvider.getPurchases(this.player).then((purchases) => {
                        this.backgrounds = purchases.backgrounds;
                        this.cardFronts = purchases.cardFronts;
                        this.cardBacks = purchases.cardBacks;
                        this.chips = purchases.chips;
                    }, (error) => {
                        // console.log("ERROR in store.ts with getting perchases");
                    });
                }, (error) => {
                    // console.log("ERROR in store.ts with getting player: ", error);
                });

            }, (error) => {
                // console.log("ERROR in store.ts on opening db: ", error);
            });
        });
        this.storeFilter = 'all';
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad StorePage');
    }

    buyBackground(backgroundObj: StoreItem) {
        if (this.player.money >= backgroundObj.price) {
            let confirm = this.alertCtrl.create({
                title: 'Are You Sure?',
                message: 'Are you sure you want to buy '+ backgroundObj.title +' for $'+ backgroundObj.price +'?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            // console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let columnName = backgroundObj.name + "_back";
                            this.storeProvider.updateStoreTable(columnName, this.player, backgroundObj).then((purchases) => {
                                // console.log("UPDATE store set " + columnName + " for " + this.player.id + " to true");
                                backgroundObj.owned = true;
                                this.askToApplySetting(backgroundObj, 'background');
                            }, (error) => {
                                // console.log("ERROR in store.ts with updating store table with background");
                            });
                        }
                    }
                ]
            });
            confirm.present();
        } else {
            this.toastProvider.showToast("Not Enough Funds to buy: " + backgroundObj.title, 3000, 'bottom', 'toastDanger');
        }
    }

    buyCardBack(cardBack: StoreItem) {
        if (this.player.money >= cardBack.price) {
            let confirm = this.alertCtrl.create({
                title: 'Are You Sure?',
                message: 'Are you sure you want to buy '+ cardBack.title +' for $'+ cardBack.price +'?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            // console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            debugger;
                            let columnName = cardBack.name + "_cardBack";
                            this.storeProvider.updateStoreTable(columnName, this.player, cardBack).then((purchases) => {
                                // console.log("UPDATE store set " + columnName + " for " + this.player.id + " to true");
                                cardBack.owned = true;
                                this.askToApplySetting(cardBack, 'cardBack');
                            }, (error) => {
                                // console.log("ERROR in store.ts with updating store table with card back");
                            });
                        }
                    }
                ]
            });
            confirm.present();
            
        } else {
            this.toastProvider.showToast("Not Enough Funds to buy: " + cardBack.title, 3000, 'bottom', 'toastDanger');
        }
    }

    buyCardFront(cardFront: StoreItem) {
        if (this.player.money >= cardFront.price) {
            let confirm = this.alertCtrl.create({
                title: 'Are You Sure?',
                message: 'Are you sure you want to buy '+ cardFront.title +' for $'+ cardFront.price +'?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            // console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let columnName = cardFront.name + "_cardFront";
                            this.storeProvider.updateStoreTable(columnName, this.player, cardFront).then((purchases) => {
                                // console.log("UPDATE store set " + columnName + " for " + this.player.id + " to true");
                                cardFront.owned = true;
                                this.askToApplySetting(cardFront, 'cardFront');
                            }, (error) => {
                                // console.log("ERROR in store.ts with updating store table with card front");
                            });
                        }
                    }
                ]
            });
            confirm.present();
            
        } else {
            this.toastProvider.showToast("Not Enough Funds to buy: " + cardFront.title, 3000, 'bottom', 'toastDanger');
        }
    }

    buyChips(chip: StoreItem) {
        if (this.player.money >= chip.price) {
            let confirm = this.alertCtrl.create({
                title: 'Are You Sure?',
                message: 'Are you sure you want to buy '+ chip.title +' for $'+ chip.price +'?',
                buttons: [
                    {
                        text: 'No',
                        handler: () => {
                            // console.log('Disagree clicked');
                        }
                    },
                    {
                        text: 'Yes',
                        handler: () => {
                            let columnName = chip.name + "_chips";
                            this.storeProvider.updateStoreTable(columnName, this.player, chip).then((purchases) => {
                                // console.log("UPDATE store set " + columnName + " for " + this.player.id + " to true");
                                chip.owned = true;
                                this.askToApplySetting(chip, 'chips');
                            }, (error) => {
                                // console.log("ERROR in store.ts with updating store table with chips");
                            });
                        }
                    }
                ]
            });
            confirm.present();
            
        } else {
            this.toastProvider.showToast("Not Enough Funds to buy: " + chip.title, 3000, 'bottom', 'toastDanger');
        }
    }

    askToApplySetting(purchase: StoreItem, col_name: string) {
        let confirm = this.alertCtrl.create({
            title: 'Apply Now?',
            message: 'Would you like to apply your new ' + purchase.title +'?',
            buttons: [
                {
                    text: 'No',
                    handler: () => {
                        // console.log('Disagree clicked');
                    }
                },
                {
                    text: 'Yes',
                    handler: () => {
                        this.applySetting(purchase, col_name);
                    }
                }
            ]
        });
        confirm.present();
    }

    applySetting(storeItem: StoreItem, col_name: String) {
        this.settingsProvider.updateOneSetting(this.player, col_name, storeItem.name).then((data) => {
            console.log("hello world");
        }, (error) => {
            // console.log("ERROR in store.ts applySetting() updateOneSetting()");
        });
    }

}
