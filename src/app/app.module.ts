import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { SettingsProvider } from '../providers/settings-provider';

import { ChangeDisplayPipe } from './pipes/change-display-pipe';

import { MyApp } from './app.component';
import { CardComponent } from './components/card/card.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { GamePage } from '../pages/game/game';
import { StorePage } from '../pages/store/store';
import { SettingsPage } from '../pages/settings/settings';

@NgModule({
  declarations: [
    MyApp,
    ChangeDisplayPipe,
    CardComponent,
    WelcomePage,
    ItemDetailsPage,
    GamePage,
    StorePage,
    SettingsPage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    ItemDetailsPage,
    GamePage,
    StorePage,
    SettingsPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, SettingsProvider]
})
export class AppModule {}
