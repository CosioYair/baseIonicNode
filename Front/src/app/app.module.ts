import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { IonicStorageModule } from '@ionic/storage';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// External validators
import {  RxReactiveFormsModule } from '@rxweb/reactive-form-validators';

// DatePicker
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

// File transfer
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { File } from '@ionic-native/file/ngx';

// Interceptors
import { AuthInterceptor } from './security/interceptors/auth.interceptor';

// Google places
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';

// NgRx
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { appMetaReducer } from './store/metaReducers/app.meta-reducer';
import { appReducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { effects } from './store/effects';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

// Fingerprint
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';

// Oauth
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';

// Spinner
import { NgxUiLoaderModule } from 'ngx-ui-loader';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { ComponentsModule } from './components/components.module';

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    StoreModule.forRoot(appReducers, { metaReducers: [appMetaReducer] }),
    EffectsModule.forRoot(effects),
    StoreDevtoolsModule.instrument({
      maxAge: 25, //  Retains last 25 states
      logOnly: environment.production, //  Restrict extension to log-only mode
    }),
    IonicStorageModule.forRoot({
      name: '__demo-touch-id-db',
      driverOrder: ['indexeddb', 'sqlite', 'websql']
    }),
    HttpClientModule,
    ComponentsModule,
    GooglePlaceModule,
    Ionic4DatepickerModule,
    RxReactiveFormsModule,
    NgxUiLoaderModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileTransfer,
    FileChooser,
    FilePath,
    File,
    Facebook,
    GooglePlus,
    KeychainTouchId,
    FingerprintAIO,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
