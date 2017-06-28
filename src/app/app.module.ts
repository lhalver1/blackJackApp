import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { AdMob } from '@ionic-native/admob';
// import { AngularFireModule } from 'angularfire2';

import { SettingsProvider } from '../providers/settings-provider';
import { PlayerProvider } from '../providers/player-provider';
import { StoreProvider } from '../providers/store-provider';
import { ToastProvider } from '../providers/toast-provider';

import { ChangeDisplayPipe } from './pipes/change-display-pipe';

import { MyApp } from './app.component';
import { CardComponent } from './components/card/card.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { MultiplayerHomePage } from '../pages/multiplayer-home-page/multiplayer-home-page';
import { GamePage } from '../pages/game/game';
import { StorePage } from '../pages/store/store';
import { SettingsPage } from '../pages/settings/settings';

export const firebaseConfig = {
    apiKey: "AIzaSyAuNitNv4gXZ2s8hDBZycaK0Cut05PDEAk",
    authDomain: "blackjack-73086800.firebaseapp.com",
    databaseURL: "https://blackjack-73086800.firebaseio.com",
    projectId: "blackjack-73086800",
    storageBucket: "blackjack-73086800.appspot.com",
    messagingSenderId: "421529295094"
  };

@NgModule({
  declarations: [
    MyApp,
    ChangeDisplayPipe,
    CardComponent,
    WelcomePage,
    ItemDetailsPage,
    GamePage,
    MultiplayerHomePage,
    StorePage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    // AngularFireModule.initializeApp(firebaseConfig)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    ItemDetailsPage,
    GamePage,
    StorePage,
    MultiplayerHomePage,
    SettingsPage
  ],
  providers: [
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AdMob,
    PlayerProvider, 
    StoreProvider, 
    SettingsProvider, 
    ToastProvider
  ]
})
export class AppModule {}
