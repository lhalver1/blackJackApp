import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';

import { PlayerProvider } from './player-provider';
import { ToastProvider } from '../providers/toast-provider';

import { Settings } from '../models/settings';
import { Player } from '../models/player';

class StoreRow {
    public player_id: string;
    public greenPoker_back: string;
    public redPoker_back: string;
    public bluePoker_back: string;
    public greenFelt_back: string;
    public spaceNight_back: string;
    public redDiamonds_cardBack: string;
    public geometric_cardBack: string;
    public material_cardFront: string;
    public classic_cardFront: string;
    public vegas_chips: string;
    public neon_chips: string;

    constructor(player_id: string, greenPoker_back: string, redPoker_back: string, bluePoker_back: string, greenFelt_back: string, spaceNight_back: string,
        redDiamonds_cardBack: string, geometric_cardBack: string, material_cardFront: string, classic_cardFront: string, vegas_chips: string, neon_chips: string) {
        this.player_id = player_id;
        this.greenPoker_back = greenPoker_back;
        this.redPoker_back = redPoker_back;
        this.bluePoker_back = bluePoker_back;
        this.greenFelt_back = greenFelt_back;
        this.spaceNight_back = spaceNight_back;
        this.redDiamonds_cardBack = redDiamonds_cardBack;
        this.geometric_cardBack = geometric_cardBack;
        this.material_cardFront = material_cardFront;
        this.classic_cardFront = classic_cardFront;
        this.vegas_chips = vegas_chips;
        this.neon_chips = neon_chips;
    }
}
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

@Injectable()
export class StoreProvider {
    player: Player;
    database: SQLite;
    settings: Settings;
    purchases: any;
    columns: string = "player_id, greenPoker_back, redPoker_back, bluePoker_back, greenFelt_back, spaceNight_back, redDiamonds_cardBack, geometric_cardBack, material_cardFront, classic_cardFront, vegas_chips, neon_chips";

    constructor(public platform: Platform, public http: Http, private playerProvider: PlayerProvider, private toastProvider: ToastProvider) {
        this.purchases = {
            'backgrounds': [],
            'cardFronts': [],
            'cardBacks': [],
            'chips': []
        }
        this.platform.ready().then(() => {
            this.database = new SQLite();
            this.database.openDatabase({
                name: "blackJackDB.db",
                location: "default"
            }).then(() => {
                // console.log("store-provider constructor();");
            }, (error) => {
                // console.error("Unable to open database in store-provider", error);
            });
        });
    }

    getPurchases(player: Player): Promise<any> {
        return new Promise((resolve, reject) => {
            this.database.executeSql("SELECT * FROM store WHERE player_id = ?", [player.id]).then((data) => {
                let storeDBItem = {};
                if (data.rows.length > 0) {
                    for (var i = 0; i < data.rows.length; i++) {
                        let dbItem = data.rows.item(i);
                        if (dbItem.player_id === player.id) {
                            storeDBItem = {
                                'player_id': dbItem.player_id,
                                'greenPoker': dbItem.greenPoker_back,
                                'redPoker': dbItem.redPoker_back,
                                'bluePoker': dbItem.bluePoker_back,
                                'greenFelt': dbItem.greenFelt_back,
                                'spaceNight': dbItem.spaceNight_back,
                                'redDiamonds': dbItem.redDiamonds_cardBack,
                                'geometric': dbItem.geometric_cardBack,
                                'material': dbItem.material_cardFront,
                                'classic': dbItem.classic_cardFront,
                                'vegas': dbItem.vegas_chips,
                                'neon': dbItem.neon_chips
                            };
                            break;
                        }
                    }

                } else {
                    // No row in store?
                    this.addStoreRow(player).then((data) => {
                        storeDBItem = {
                            'player_id': data.player_id,
                            'greenPoker': data.greenPoker_back,
                            'redPoker': data.redPoker_back,
                            'bluePoker': data.bluePoker_back,
                            'greenFelt': data.greenFelt_back,
                            'spaceNight': data.spaceNight_back,
                            'redDiamonds': data.redDiamonds_cardBack,
                            'geometric': data.geometric_cardBack,
                            'material': data.material_cardFront,
                            'classic': data.classic_cardFront,
                            'vegas': data.vegas_chips,
                            'neon': data.neon_chips
                        };
                    });
                }

                this.purchases.backgrounds = [
                    new StoreItem('Green Poker', 'assets/img/backgrounds/greenPoker.png', 'A nice classic table to play some black jack with your friends on!', 8500, 'greenPoker', storeDBItem['greenPoker'] === 'true'),
                    new StoreItem('Red Poker', 'assets/img/backgrounds/redPoker.png', 'Red is for warning, because at this table it shows you mean business!', 8500, 'redPoker', storeDBItem['redPoker'] === 'true'),
                    new StoreItem('Blue Poker', 'assets/img/backgrounds/bluePoker.png', 'A blue, calming twist on the classic green black jack table.', 8500, 'bluePoker', storeDBItem['bluePoker'] === 'true'),
                    new StoreItem('Green Felt', 'assets/img/backgrounds/greenFelt.png', 'A nice table to play some black jack with your friends on!', 2000, 'greenFelt', true),
                    new StoreItem('Space Night', 'assets/img/storePics/space_night.jpg', 'Nothing like playing cards under the night sky with a full moon!', 8500, 'spaceNight', storeDBItem['spaceNight'] === 'true')
                ];
                this.purchases.cardFronts = [
                    new StoreItem('Classic', 'assets/img/storePics/classic.png', 'If you were to play cards at a casino, their cards would probably look something like this.', 2000, 'classic', storeDBItem['classic'] === 'true'),
                    new StoreItem('Material', 'assets/img/storePics/material.png', 'A spin off of Google\'s material design, these cards are minimalistic and simple but beautiful.', 8000, 'material', storeDBItem['material'] === 'true')
                ];
                this.purchases.cardBacks = [
                    new StoreItem('Red Diamonds', 'assets/img/storePics/redDiamonds.png', 'Can\'t go wrong with the red diamonds, unless the dealer turns them over for Black Jack.', 2000, 'redDiamonds', storeDBItem['redDiamonds'] === 'true'),
                    new StoreItem('Geometric', 'assets/img/storePics/geometric.png', 'This is a colorful and vibrant card back, almost makes you not want to turn the card over.', 8000, 'geometric', storeDBItem['geometric'] === 'true')
                ];
                this.purchases.chips = [
                    new StoreItem('Vegas', 'assets/img/storePics/vegas.png', 'The good ol classic vegas style chips. Certainly would love stacks of the gold chip.', 2000, 'vegas', storeDBItem['vegas'] === 'true'),
                    new StoreItem('Neon', 'assets/img/storePics/neon.png', 'These chips will match all the neon lights in the casino and light up the table.', 9000, 'neon', storeDBItem['neon'] === 'true')
                ];
                resolve(this.purchases);
            }, (error) => {
                // console.log("ERROR getting purchases in store-provider: " + JSON.stringify(error));
                reject(error);
            });
        });

    }//END getPurchasese();

    addStoreRow(player: Player): Promise<StoreRow> {
        return new Promise((resolve, reject) => {
            this.database.executeSql("INSERT INTO store (" + this.columns + ") " +
                " VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [player.id + "", 'false', 'false', 'false', 'true', 'false', 'true', 'false', 'false', 'true', 'true', 'false']).then((data) => {
                    resolve(data);
                }, (error) => {
                    // console.log("ERROR store-provider addStoreRow() INSERT INTO store: " + JSON.stringify(error.message));
                    reject(error);
                });
        });
    }

    updateStoreTable(columnName: string, player: Player, item: StoreItem): Promise<StoreRow> {
        return new Promise((resolve, reject) => {
            // update db that user bought this background
            this.toastProvider.showToast('You bought: ' + item.title + ' for: $' + item.price, 3000, 'bottom', 'toastSuccess');
    
            this.database.executeSql("UPDATE store SET " + columnName + " = 'true' WHERE player_id = ?", [player.id]).then((data) => {
                player.subtractMoney(item.price);
                this.playerProvider.updatePlayer(player).then((result) => {
                    resolve(data);
                }, (error) => {
                    // console.log("ERROR store-provider updateStoreTable() UPDATE player: ", error);
                    player.addMoney(item.price);
                });
            }, (error) => {
                // console.log("ERROR store-provider updateStoreTable() UPDATE store: " + JSON.stringify(error.message));
                reject(error);
            });
        });
    }

}
