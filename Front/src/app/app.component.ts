import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Store } from '@ngrx/store';
import { AppState } from './store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  private _loading: Boolean = false;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private ngxService: NgxUiLoaderService,
    private _store: Store<AppState>
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this._store.select(fromStore.getLoadingProcesses)
      .subscribe(async loadingProcesses => {
        if (loadingProcesses.length > 0) {
          if (!this._loading) {
            this._loading = true;
            this.ngxService.start();
          }
        } else {
          if (this._loading) {
            this._loading = false;
            this.ngxService.stop();
          }
        }
      });
  }

}
