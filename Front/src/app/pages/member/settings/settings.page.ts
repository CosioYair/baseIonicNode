import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { KeychainTouchId } from '@ionic-native/keychain-touch-id/ngx';
import { FingerprintAIO } from '@ionic-native/fingerprint-aio/ngx';
import { Storage } from '@ionic/storage';
import { AlertController } from '@ionic/angular';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { UserService } from 'src/app/services/user.service';
import { Router } from '@angular/router';
import { log } from 'util';
import { Platform } from '@ionic/angular';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  private _user: User;
  public form: FormGroup;
  public fingerprintToken: any;
  public appLanguage: Language;
  private getAppLanguage$: Observable<Language>;
  public languageConfig: LanguageConfig = new LanguageConfig();
  private _subscriptions: Subscription[] = [];

  constructor(private keychainTouchId: KeychainTouchId,
    private faio: FingerprintAIO,
    private storage: Storage,
    private alertController: AlertController,
    private _store: Store<AppState>,
    private _userService: UserService,
    private _router: Router,
    private platform: Platform) {
    this.form = new FormGroup({
      fingerprint: new FormControl(false)
    });
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
  }

  async ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this.appLanguage = appLanguage; }),
      this._store.select(fromStore.getUserInfo).subscribe(user => { this._user = user; })
    );
    await this.fingerprintTokenExists();
    this.form.controls['fingerprint'].setValue(this.fingerprintToken);
  }

  fingerprintTokenExists() {
    return this.storage.get('FINGER_PRINT_KEY').then(data => {
      this.fingerprintToken = !!data;
    });
  }

  async enableFingerprint() {
    const alert = await this.alertController.create({
      header: this.languageConfig[this.appLanguage.Code].alerts.confirmPasswordHeader,
      message: this.languageConfig[this.appLanguage.Code].alerts.confirmPasswordMessage,
      inputs: [
        {
          name: 'password',
          placeholder: this.languageConfig[this.appLanguage.Code].inputs.password,
          type: 'password'
        }
      ],
      buttons: [
        {
          text: this.languageConfig[this.appLanguage.Code].common.cancel,
          handler: () => {
            console.log('Dismiss');
          }
        },
        {
          text: this.languageConfig[this.appLanguage.Code].common.save,
          handler: async data => {
            await this.saveTouchAuthCredential(data.password);
          }
        }
      ]
    });
    await alert.present();
  }

  private async saveTouchAuthCredential(password: string): Promise<boolean> {
    try {
      const email: string = this._user.Email;
      const isAvailable = await this.isAvailable();
      if (isAvailable) {
        const passwordsMatch = await this._userService.comparePassword(this._user.Oid, password);
        if (passwordsMatch) {
          await this.keychainTouchId.save(email, password).catch(err => { console.log(err); });
          await this.storage.set('FINGER_PRINT_KEY', { username: email, token: + Date.now() }).catch(err => { console.log(err); });
          this._router.navigate(['/']);
          return true;
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: this.languageConfig[this.appLanguage.Code].alerts.invalidPassword,
            buttons: [
              {
                text: this.languageConfig[this.appLanguage.Code].common.close
              }
            ]
          });
          await alert.present();
        }
      }
    } catch (e) {
      console.log(e);
    }
    return false;
  }

  updateSettings() {
    if (this.form.value.fingerprint) {
      this.enableFingerprint();
    } else {
      this.disableFingerprint();
    }
  }

  public async disableFingerprint() {
    const alert = await this.alertController.create({
      header: this.languageConfig[this.appLanguage.Code].alerts.disableFingerprintHeader,
      message: this.languageConfig[this.appLanguage.Code].alerts.disableFingerprintMessage,
      buttons: [
        {
          text: this.languageConfig[this.appLanguage.Code].common.cancel,
          handler: () => {
            console.log('Dismiss');
          }
        },
        {
          text: this.languageConfig[this.appLanguage.Code].alerts.disable,
          handler: async () => {
            await this.storage.remove('FINGER_PRINT_KEY');
            await this.keychainTouchId.delete(this._user.Email);
            this._router.navigate(['/home']);
          }
        }
      ]
    });

    await alert.present();
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
