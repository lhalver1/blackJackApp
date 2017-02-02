import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { ChangeDisplayPipe } from './pipes/change-display-pipe';

import { MyApp } from './app.component';
import { CardComponent } from './components/card/card.component';
import { WelcomePage } from '../pages/welcome/welcome';
import { ItemDetailsPage } from '../pages/item-details/item-details';
import { GamePage } from '../pages/game/game';

@NgModule({
  declarations: [
    MyApp,
    ChangeDisplayPipe,
    CardComponent,
    WelcomePage,
    ItemDetailsPage,
    GamePage
  ],
  imports: [
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    WelcomePage,
    ItemDetailsPage,
    GamePage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
