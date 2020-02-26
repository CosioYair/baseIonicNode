import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromStore from '../store/reducers';
import { authActions } from '../store/actions';
import { HttpClient } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { DecodedJwt } from '../interfaces/decoded-jwt';
import { AuthState } from '../store/reducers/auth.reducer';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _api: String = 'http://localhost:3000/api';
  private _auth: AuthState;
  private _storeJwt: string;

  constructor(private _router: Router,
    private _store: Store<AppState>,
    private _storage: Storage,
    private _http: HttpClient) {
    this._auth = <AuthState>{};
    this._storage.get('jwt').then(jwt => {
      this._storeJwt = jwt;
      this._store.select(fromStore.getAuthState).subscribe(auth => {
        this._auth = auth;
        console.log(this._auth);
      });
      if (this._auth.jwt !== this._storeJwt) {
        this._store.dispatch(new authActions.SetJwt({ jwt }));
      }
    });
  }

  localLogin(email: string, password: string, roleId: any, tfaId: number = null, tfaToken: string = null) {
    return this._http.post(`${this._api}/auth/localLogin`, {
      Email: email,
      Password: password,
      RoleId: roleId,
      tfaId,
      tfaToken
    }).pipe(
      map(response => response['token'])
    );
  }

  signup(email: string, password: string, roleId: string) {
    return this._http.post(`${this._api}/auth/signup`, {
      RoleId: roleId,
      RegisterTypeId: 1,
      ConfirmEmailUrl: 'http://localhost:8080/emailConfirmation',
      UserData: {
        Email: email,
        Password: password
      }
    }).pipe(
      map(response => response['token'])
    );
  }

  oauthLogin(loginType: string, accessToken: string) {
    return this._http.post(`${this._api}/auth/${loginType}/token?access_token=${accessToken}`, {}).pipe(
      map(response => response['token'])
    );
  }

  login(jwt: string) {
    const loginSuscriber = this._store.select(fromStore.getLoadingProcesses)
      .subscribe(loadingProcesses => {
        if (loadingProcesses.length === 0) {
          if (this._auth.jwt !== this._storeJwt) {
            this._storage.set('jwt', jwt);
            this._router.navigate(['/member']);
          }
          if (loginSuscriber) {
            loginSuscriber.unsubscribe();
          }
        }
      });
  }

  async logout() {
    await this._storage.remove('jwt');
    this._router.navigate(['/auth']);
  }

  decodeJwt(jwt: string): DecodedJwt {
    try {
      const jwtObject = jwt_decode(jwt);
      const decodeJwt: DecodedJwt = {
        Oid: jwtObject.Oid,
        Privileges: jwtObject.Privileges,
        Exp: new Date(jwtObject.exp * 1000),
        Iat: new Date(jwtObject.iat * 1000),
      };
      return decodeJwt;
    } catch (Error) {
      return <DecodedJwt>{};
    }
  }

  isAuth(): boolean {
    if (!this._auth.isAuth) {
      this._store.dispatch(new authActions.SetJwt({ jwt: null }));
      this._router.navigate(['/auth']);
    }
    return !!this._auth.isAuth;
  }

  isNoAuth() {
    const isNoAuth = !this._auth.isAuth;
    if (!isNoAuth) {
      this._router.navigate(['/']);
    }
    return !!isNoAuth;
  }

}
