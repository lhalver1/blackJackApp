import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SettingsProvider } from '../../providers/settings-provider';

import { Settings } from '../../models/settings';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  settings: Settings;

  constructor(public navCtrl: NavController, public navParams: NavParams, public service: SettingsProvider) {
    this.settings = this.service.getSettings();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SettingsPage');
  }

}
