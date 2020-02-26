import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromAuth from 'src/app/store/actions/auth.actions';
import { MenuController } from '@ionic/angular';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import * as fromStore from 'src/app/store/reducers';
import { Language } from 'src/app/interfaces/language';
import { User } from 'src/app/interfaces/user';
import { authActions } from 'src/app/store/actions';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent implements OnInit, OnDestroy {

  public languageConfig: LanguageConfig = new LanguageConfig();
  private getAppLanguage$: Observable<Language>;
  private getUser$: Observable<User>;
  public userProfileImg: File = <File>{};
  public random: number = Math.random();
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>,
    private _menuCtrl: MenuController) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getUser$ = this._store.select(fromStore.getUserInfo);
  }

  ngOnInit() {
    this._subscriptions.push(
      this._store.select(fromStore.getUserFile, { fileType: 4 }).subscribe(userFile => {
        this.random = Math.random();
        this.userProfileImg = userFile;
      })
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  menuToggle() {
    this._menuCtrl.toggle();
  }

  logout() {
    this._store.dispatch(new authActions.SetJwt({ jwt: null }));
    this.menuToggle();
  }

}
