import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Settings } from '../models/settings';

@Injectable()
export class SettingsProvider {
  settings: Settings;

  constructor(public http: Http) {
    this.settings = new Settings(2000, false, false, 'spacePlanet', 'redDiamonds', 'material');
  }

  getSettings(): Settings {
    return this.settings;
  }

  setTableBackground(backgroundName: string): void {
    this.settings.selectedBackground = backgroundName;
  }

  setCardBack(cardBackName: string): void {
    this.settings.selectedCardBack = cardBackName;
  }

  setCardFront(cardFrontName: string) {
    this.settings.selectedCardFront = cardFrontName;
  }

}
