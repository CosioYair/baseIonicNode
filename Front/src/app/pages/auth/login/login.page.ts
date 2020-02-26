import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { FormGroup, FormControl, Validators, FormBuilder } from '@angular/forms';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { LanguageConfig } from 'src/app/language-config';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { ActivatedRoute } from '@angular/router';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { authActions } from 'src/app/store/actions';
import { Error } from 'src/app/interfaces/error';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  public form: FormGroup;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _authService: AuthService,
    public formBuilder: FormBuilder,
    private _fb: Facebook,
    private _googlePlus: GooglePlus,
    private _activateRoute: ActivatedRoute,
    private platform: Platform,
    private _store: Store<AppState>,
    private storage: Storage,
    private keychainTouchId: KeychainTouchId,
    private faio: FingerprintAIO) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ])
    });
  }

  ngOnInit() {
    this.verifySocialLogin();
    this.tryAuth();
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => {
        if (decodedJwt.Oid) {
          this.form.reset();
        }
      }),
      this._store.select(fromStore.getAuthAlert, { actionType: authActions.LOCAL_LOGIN }).subscribe(alertOptions => {
        if (alertOptions) {
          this.alertOptions = alertOptions;
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.alertOptions) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: authActions.LOCAL_LOGIN }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  login() {
    this._store.dispatch(
      new authActions.LocalLogin({
          email: this.form.value.Email,
          password: this.form.value.Password,
          roleId: '1'
      })
    );
  }

  async signInWithFacebook() {
    await this._fb.login(['email', 'public_profile']).then((res: FacebookLoginResponse) => {
      const accessToken = res.authResponse.accessToken;
      this._store.dispatch(new authActions.OauhtLogin({
          loginType: 'facebook',
          accessToken
      }));
    }).catch(err => {
      console.log(JSON.stringify(err));
      return err;
    });
  }

  async signInWithGoogle() {
    await this._googlePlus.login({})
      .then(res => {
        const accessToken = res.accessToken;
        this._store.dispatch(new authActions.OauhtLogin({
            loginType: 'google',
            accessToken
        }));
      })
      .catch(err => {
        console.log(JSON.stringify(err));
        return err;
      });
  }

  async verifySocialLogin() {
    let token: any = this._activateRoute.snapshot.queryParamMap.get('token');
    if (token) {
      token = token.search('Code') >= 0 ? JSON.parse(token) : token;
      if (typeof (token) !== 'object') {
        this._store.dispatch(new authActions.SetJwt({ jwt: token }));
      } else {
        const alertOption: AlertOptions = <AlertOptions>{};
        alertOption.Type = 'danger';
        alertOption.TextColor = 'dark';
        alertOption.Status = true;
        alertOption.Message = this.languageConfig[this._appLanguage.Code].backend.errors[token.Code];
        alertOption.CloseAction = new authActions.RemoveAuthAlert({ action: authActions.LOCAL_LOGIN });
        alertOption.ActionType = authActions.LOCAL_LOGIN;
        alertOption.Code = token.Code;
        this._store.dispatch(new authActions.AddAuthAlert({ alertOption }));
      }
    }
  }

  public async tryAuth(): Promise<boolean> {
    try {
      const isAvailable = await this.isAvailable();

      if (isAvailable) {
        const auth: { username: string, token: string } = await <any>this.storage.get('FINGER_PRINT_KEY');

        if (auth && auth.username) {
          const password = await this.keychainTouchId.verify(auth.username, 'LOGIN');

          if (password) {
            this._authService.localLogin(auth.username, password, this._appLanguage.Id)
              .pipe(take(1))
              .subscribe(response => {
                const token = response['token'];
                this._authService.login(token);
                this.form.reset();
              }, err => {
                const errorCode = err.error ? err.error.Code : 399;
                this.alertOptions.Type = 'danger';
                this.alertOptions.TextColor = 'dark';
                this.alertOptions.Status = true;
                this.alertOptions.Message = this.languageConfig[this._appLanguage.Code].backend.errors[errorCode];
              });
            return true;
          }
        }

        return false;
      }
    } catch (e) { }

    return new Promise<boolean>((resolve, reject) => resolve(false));
  }

  public async isAvailable(): Promise<boolean> {
    try {
      if (this.platform.is('android') || this.platform.is('ios')) {
        return await this.faio.isAvailable();
      }
    } catch (e) {
      console.log('Error:' + e);
    }

    return new Promise<boolean>((resolve, reject) => resolve(false));
  }
}
