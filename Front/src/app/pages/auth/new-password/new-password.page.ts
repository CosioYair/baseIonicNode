import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { tokenActions } from 'src/app/store/actions';
import * as fromStore from 'src/app/store/reducers';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Error } from 'src/app/interfaces/error';
import { matchValidator } from 'src/app/validators/match-validator';

@Component({
  selector: 'app-new-password',
  templateUrl: './new-password.page.html',
  styleUrls: ['./new-password.page.scss'],
})
export class NewPasswordPage implements OnInit, OnDestroy {

  public form: FormGroup;
  public formToken: FormGroup;
  public formPassword: FormGroup;
  public getEmailSendStatus$: Observable<Boolean>;
  public getValidTokenStatus$: Observable<Boolean>;
  public getConfirmedTokenStatus$: Observable<Boolean>;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptions: AlertOptions = <AlertOptions>{};
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _error: Error;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getEmailSendStatus$ = this._store.select(fromStore.getEmailSendStatus);
    this.getValidTokenStatus$ = this._store.select(fromStore.getValidTokenStatus);
    this.getConfirmedTokenStatus$ = this._store.select(fromStore.getConfirmedTokenStatus);
    this.form = new FormGroup({
      Email: new FormControl(null, [
        Validators.required,
        Validators.pattern(/[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$/)
      ])
    });
    this.formToken = new FormGroup({
      Token: new FormControl(null, [
        Validators.required
      ])
    });
    this.formPassword = new FormGroup({
      Password: new FormControl('', [
        Validators.required,
        Validators.minLength(6)
      ]),
      PasswordConfirm: new FormControl('', [
        Validators.required,
        matchValidator('Password')
      ]),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getTokenActionsError).subscribe(error => {
        this._error = error;
        if (this._error) {
          this.alertOptions.Type = 'danger';
          this.alertOptions.TextColor = 'dark';
          this.alertOptions.Status = true;
          this.alertOptions.Message = this.languageConfig[this._appLanguage.Code].backend.errors[error.Code];
          this.alertOptions.CloseAction = new tokenActions.SetError({ error: null });
        } else {
          this.alertOptions = <AlertOptions>{};
        }
      })
    );
  }

  ngOnDestroy() {
    if (this._error) {
      this._store.dispatch(new tokenActions.SetError({ error: null }));
    }
    this._store.dispatch(new tokenActions.SetEmailSendStatus({ status: false }));
    this._store.dispatch(new tokenActions.SetValidTokenStatus({ status: false }));
    this._store.dispatch(new tokenActions.SetConfirmedTokenStatus({ status: false }));
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  newPasswordRequest() {
    this._store.dispatch(new tokenActions.NewTokenByEmail({ actionId: 3, laguageId: this._appLanguage.Id, email: this.form.value.Email }));
  }

  validateToken() {
    this._store.dispatch(new tokenActions.ValidateToken({ token: this.formToken.value.Token }));
  }

  setNewPassword() {
    this._store.dispatch(new tokenActions.ConfirmToken({
      token: this.formToken.value.Token,
      payload: { NewPassword: this.formPassword.value.Password }
    }));
  }

  get mainForm() { return this.form.controls; }
  get tokenForm() { return this.formToken.controls; }
  get passwordForm() { return this.formPassword.controls; }
}
