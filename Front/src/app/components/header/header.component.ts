import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import * as auhtActions from 'src/app/store/actions/auth.actions';
import { LanguageConfig } from 'src/app/language-config';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {

  public getLanguages$: Observable<Language[]>;
  public getAppLanguage$: Observable<Language>;
  private getUser$: Observable<User>;
  public languages: Language[] = [];
  public languageConfig: LanguageConfig = new LanguageConfig();
  private _subscriptions: Subscription[] = [];
  @Input() title: string;

  constructor(private _store: Store<AppState>,
    private _storage: Storage) {
    this.getLanguages$ = this._store.select(fromStore.getLanguages);
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getUser$ = this._store.select(fromStore.getUserInfo);
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getLanguages$.subscribe(languages => { this.languages = languages; })
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  logout() {
    this._store.dispatch(new auhtActions.SetJwt({ jwt: null }));
  }

  async setAppLanguage(event) {
    const newLanguage = this.languages.find(language => language.Id === event.detail.value);
    this._storage.set('appLanguage', JSON.stringify(newLanguage));
    location.reload();
  }

}
