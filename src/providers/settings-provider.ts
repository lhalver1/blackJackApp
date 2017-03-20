import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';

import { Settings } from '../models/settings';
import { Player } from '../models/player';

@Injectable()
export class SettingsProvider {
    player: Player;
    database: SQLite;
    settings: Settings;

    constructor(public platform: Platform, public http: Http) {
        // debugger;
        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({
                name: "blackJackDB.db",
                location: "default"
            }).then(() => {
                // console.log("settings-provider initSettings();");
            }, (error) => {
                // console.error("Unable to open database in app.component", error);
            });
        });
    }

    getSettings(player: Player): Promise<Settings> {
        return new Promise((resolve, reject) => {
            let newSettings: Settings;
            this.database.executeSql("SELECT * FROM settings WHERE player_id = ?", [player.id]).then((settingsData) => {
                if (settingsData.rows.length > 0) {
                    for (var i = 0; i < settingsData.rows.length; i++) {
                        let settingsRow = settingsData.rows.item(i);
                        if (settingsRow.player_id === player.id) {
                            // console.log("settings-provider settings Loaded!");
                            newSettings = new Settings(settingsRow.cpu_time, false, false, settingsRow.background, settingsRow.cardBack, settingsRow.cardFront, settingsRow.chips);
                            break;
                        }
                    }
                } else {
                    //No Players in db
                    // console.log("settings-provider.ts getSettings(player): No row for player in settings table, adding");
                    this.addSettings(new Settings(2, false, false, "greenFelt", "redDiamonds", "classic", "vegas"), player).then((settings) => {
                        newSettings = settings;
                    });
                }
                resolve(newSettings)
            }, (error) => {
                // console.log("ERROR settings-provider.ts getSettings(player): " + JSON.stringify(error));
                reject(error);
            });
        });
    }

    addSettings(settings: Settings, player: Player): Promise<Settings> {
        return new Promise((resolve, reject) => {
            this.database.executeSql("INSERT INTO settings (player_id, background, cardFront, cardBack, chips, cpu_time) VALUES (?,?,?,?,?,?)",
                [player.id, settings.selectedBackground, settings.selectedCardFront, settings.selectedCardBack, settings.chips, settings.cpuDecisionTime]).then((resultSet) => {
                // console.log("INSERTED into settings: " + JSON.stringify(resultSet));
                resolve(resultSet);
            }, (error) => {
                // console.log("ERROR in settings-provider addSettings(settings: Settings, player: Player): " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

    updateSettings(player: Player, settings: Settings) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("UPDATE settings SET background = ?, cardFront = ?, cardBack = ?, chips = ?, cpu_time = ? WHERE id = ?",
                [settings.selectedBackground, settings.selectedCardFront, settings.selectedCardBack, settings.chips, settings.cpuDecisionTime, player.id]).then((resultSet) => {
                // console.log("UPDATED settings in settings-provider: " + JSON.stringify(resultSet));
                resolve(resultSet);
            }, (error) => {
                // console.log("SQL ERROR in settings-provider updateSettings(): " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

    updateOneSetting(player: Player, col_name: String, value: string) {
        return new Promise((resolve, reject) => {
            this.database.executeSql("UPDATE settings SET " + col_name +" = ? WHERE id = ?",
                [value, player.id]).then((resultSet) => {
                // console.log("UPDATED settings in settings-provider: " + JSON.stringify(resultSet));
                resolve(resultSet);
            }, (error) => {
                // console.log("SQL ERROR in settings-provider updateSettings(): " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

}
