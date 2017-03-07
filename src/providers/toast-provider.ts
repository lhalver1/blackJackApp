import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Platform, ToastController } from 'ionic-angular';
import { SQLite } from 'ionic-native';
import 'rxjs/add/operator/map';

import { Settings } from '../models/settings';
import { Player } from '../models/player';

@Injectable()
export class ToastProvider {

    constructor(public platform: Platform, public http: Http, private toastCtrl: ToastController) {

    }

    /**
     * Shows a toast with the given message for the given duration and
     * in the given position.
     * 
     * @param  {string} msg - Message in the toast
     * @param  {number} duration - In milliseconds, the duration of the toast
     * @param  {string} position - 'top', 'bottom', 'middle' position of the toast on the screen
     * @param  {string} cssClass -  '.toastSuccess', '.toastDanger', '.toastWarning' ... bootstrap like class to apply to toast
     * @returns void
     */
    showToast(msg: string, duration: number, position: string, cssClass: string): void {
        let toast = this.toastCtrl.create({
        message: msg,
        duration: duration,
        position: position,
        cssClass: cssClass
      });
    
      toast.onDidDismiss(() => {
        console.log('Dismissed toast');
      });
    
      toast.present();
    }

}
