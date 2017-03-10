import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';

import { Settings } from '../models/settings';
import { Player } from '../models/player';

@Injectable()
export class PlayerProvider {
    player: Player;
    database: SQLite;
    settings: Settings;

    constructor(public platform: Platform, public http: Http) {
        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({
                name: "blackJackDB.db",
                location: "default"
            }).then(() => {
                // console.log("player-provider constructor();");
            }, (error) => {
                // console.error("Unable to open database in player-provider", error);
            });
        });
    }

    getPlayer(): Promise<Player> {
        return new Promise((resolve, reject) => {
            let player: Player;
            this.database.executeSql("SELECT * FROM players", []).then((data) => {
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        let row = data.rows.item(i);
                        player = new Player(row.id, row.name, [], row.money, false, "Human", 0, 0);
                    }
                } else {
                    //No Players in db
                    // console.log("player-provider.ts getPlayer(): No players in player table, adding");
                    this.addPlayer(new Player(-1, "Player", [], 2000, false, "Human", 0, 0)).then((data) => {
                        player = data;
                    });
                }
                resolve(player);
            }, (error) => {
                // console.log("SQL ERROR player-provider getPlayer(): " + JSON.stringify(error));
                reject(error);
            });
        });
    }

    addPlayer(player: Player): Promise<Player> {
        return new Promise((resolve, reject) => {
            this.database.executeSql("INSERT INTO players (name, money) VALUES (?,?)", [player.name, player.money]).then((resultSet) => {
                // console.log("INSERTED into players: " + JSON.stringify(resultSet));
                resolve(resultSet);
            }, (error) => {
                // console.log("ERROR in player-provider addPlayer(player: Player): " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

    updatePlayer(player: Player): Promise<Player> {
        return new Promise((resolve, reject) => {
            this.database.executeSql("UPDATE players SET name = ?, money = ? WHERE id = ?", [player.name, player.money, player.id]).then((resultSet) => {
                // console.log("UPDATED player in player-provider: " + JSON.stringify(resultSet));
                resolve(resultSet);
            }, (error) => {
                // console.log("SQL ERROR in player-provider updatePlayer(): " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

}
