import { Component } from '@angular/core';
import { Platform, NavController, NavParams } from 'ionic-angular';
import { SQLite } from 'ionic-native';

import { SettingsProvider } from '../../providers/settings-provider';
import { PlayerProvider } from '../../providers/player-provider';
import { StoreProvider } from '../../providers/store-provider';
import { ToastProvider } from '../../providers/toast-provider';

import { Settings } from '../../models/settings';
import { Player } from '../../models/player';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {
    settings: Settings;
    database: SQLite;
    player: Player;
    purchases: any;

    constructor(public platform: Platform,
        public navCtrl: NavController,
        public navParams: NavParams,
        public settingsProvider: SettingsProvider,
        public playerProvider: PlayerProvider,
        public storeProvider: StoreProvider,
        public toastProvider: ToastProvider) {
        this.settings = new Settings(2000, false, false, "greenFelt", "redDiamonds", "material", "vegas");//default that gets overriden
        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({ name: "blackJackDB.db", location: "default" }).then(() => {

                this.playerProvider.getPlayer().then((player) => {

                    this.player = new Player(player.id, player.name, [], player.money, false, "Human", 0, 0);
                    this.settingsProvider.getSettings(this.player).then((settings) => {
                        // debugger;
                        this.settings = settings;

                        this.storeProvider.getPurchases(this.player).then((purchases) => {
                            this.purchases = purchases;
                        }, (error) => {
                            // console.log("ERROR in settingsPage with getting purchases: ", error);
                        });

                    }, (error) => {
                        // console.log("ERROR in settingsPage with getting settings: ", error);
                    });

                }, (error) => {
                    // console.log("ERROR in settingsPage with getting player: ", error);
                });

            }, (error) => {
                // console.log("ERROR in settingsPage on opening db: ", error);
            });
        });
    }

    ionViewDidLoad() {
        // console.log('ionViewDidLoad SettingsPage');
    }

    save() {
        this.database.executeSql("UPDATE settings SET background = '" + this.settings.selectedBackground +
            "', cardFront = '" + this.settings.selectedCardFront +
            "', cardBack = '" + this.settings.selectedCardBack +
            "', chips = '" + this.settings.chips +
            "', cpu_time = '" + this.settings.cpuDecisionTime +
            "' WHERE id = " + this.player.id + "", []).then((data) => {
                this.toastProvider.showToast("Settings Saved!", 3000, 'bottom', 'toastSuccess');
                // console.log("UPDATED settings table: " + JSON.stringify(this.settings));
            }, (error) => {
                // console.log("ERROR: " + JSON.stringify(error.message));
                this.toastProvider.showToast("Failed: Settings not saved", 3000, 'bottom', 'toastDanger');
            });
    }

    cancel() {
        this.storeProvider.getPurchases(this.player).then((purchases) => {
            this.purchases = purchases;
        }, (error) => {
            // console.log("ERROR in settingsPage with getting purchases: ", error);
        });
    }

}
