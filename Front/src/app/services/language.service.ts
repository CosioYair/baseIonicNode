import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { uiActions } from '../store/actions';
import { map } from 'rxjs/operators';
import { Language } from '../interfaces/language';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  private _api: String = 'http://localhost:3000/api';

  constructor(
    private _store: Store<AppState>,
    private _storage: Storage,
    private _http: HttpClient) {
    this.setAppLanguage();
    this.loadLanguages();
  }

  private setAppLanguage() {
    this._storage.get('appLanguage').then(appLanguage => {
      appLanguage = JSON.parse(appLanguage);
      this._store.select(fromStore.getAppLanguage).subscribe(storeAppLanguage => {
        if (appLanguage == null) {
          this._storage.set('appLanguage', JSON.stringify(storeAppLanguage));
        } else {
          if (appLanguage.Id !== storeAppLanguage.Id) {
            this._store.dispatch(new uiActions.SetAppLanguage({language: appLanguage}));
          }
        }
      });
    });
  }

  public loadLanguages() {
    setTimeout(() => {
      this._store.dispatch(new uiActions.LoadLanguages());
    }, 1000);
  }

  getLanguages() {
    return this._http.get(`${this._api}/languages`)
      .pipe(
        map(response => response['Languages'])
      );
  }

  setStoreLanguages(languages: Language[]) {
    return this._storage.set('languages', JSON.stringify(languages));
  }

  getStoreLanguages() {
    return from(this._storage.get('languages'))
      .pipe(
        map(languages => JSON.parse(languages))
      );
  }

}
