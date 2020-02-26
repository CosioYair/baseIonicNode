import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { matchValidator } from 'src/app/validators/match-validator';
import { Platform } from '@ionic/angular';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { authActions } from 'src/app/store/actions';
import { Error } from 'src/app/interfaces/error';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit, OnDestroy {

  public confirmarPassword: string;
  public form: FormGroup;
  public TerminosOcc: boolean;
  public language: any;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>,
    private _platform: Platform) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/)
      ]),
      Password: new FormControl(null, [
        Validators.required,
        Validators.minLength(6)
      ]),
      confirmarPassword: new FormControl(this.confirmarPassword, [
        Validators.required,
        matchValidator('Password')
      ]),
      TerminosOcc: new FormControl(this.TerminosOcc, [
        Validators.requiredTrue
      ]),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => {
        if (decodedJwt.Oid) {
          this.form.reset();
        }
      }),
      this._store.select(fromStore.getAuthAlert, { actionType: authActions.SIGNUP_LOGIN }).subscribe(alertOptions => {
        if (alertOptions) {
          this.alertOptions = alertOptions;
        }
      })
    );
  }

  ngOnDestroy() {
    if (this.alertOptions) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: authActions.SIGNUP_LOGIN }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  signup() {
    this._store.dispatch(new authActions.SignupLogin({
      email: this.form.value.Email,
      password: this.form.value.Password,
      roleId: '1'
    }));
  }

}
