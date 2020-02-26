import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { AppState } from '../store/reducers';
import * as fromStore from '../store/reducers';
import { map } from 'rxjs/operators';
import { User } from '../interfaces/user';
import { Observable } from 'rxjs';
import { Tfa } from '../interfaces/tfa';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private _user: User;
  private _api: String = 'http://localhost:3000/api';

  constructor(private _http: HttpClient,
    private _store: Store<AppState>
  ) {
    this._store.select(fromStore.getUserInfo).subscribe(user => {
      this._user = user;
    });
  }

  public show(Oid: string) {
    return this._http.get(`${this._api}/users/${Oid}`, {})
    .pipe(
      map(response => response['User'])
    );
  }

  public getPendingProcesses(Oid: string) {
    return this._http.get(`${this._api}/users/${Oid}/pendingActiveProcessGroups`, {})
    .pipe(
      map(response => response['PendingProcesses'])
    );
  }

  create(user: User, roleId: number, registerTypeId: number, confirmUrl: string) {
    return this._http.post(`${this._api}/users`, {
      UserData: user,
      RoleId: roleId,
      RegisterTypeId: registerTypeId,
      ConfirmUrl: confirmUrl
    }).pipe(
      map(response => response['User'])
    );
  }

  update(oid: string, user: User) {
    return this._http.put(`${this._api}/users/${oid}`, {
      UserData: user
    }).pipe(
      map(response => response['User'])
    );
  }

  comparePassword(userOid: string, password: string) {
    return this._http.post(`${this._api}/users/${userOid}/comparePassword`, {
      Password: password
    }).toPromise();
  }

  getUnconfirmedUsers(): Observable<User[]> {
    return this._http.get(`${this._api}/users/${this._user.Oid}/unconfirmed`)
    .pipe(
      map(response => response['Users'])
    );
  }

  enableTfa(tfaId: number): Observable<Tfa> {
    return this._http.post(`${this._api}/users/enableTfa`, { tfaId })
      .pipe(
        map(response => response['Tfa'])
      );
  }

  disableTfa(tfaId: number): Observable<Tfa> {
    return this._http.post(`${this._api}/users/disableTfa`, { tfaId })
      .pipe(
        map(response => response['Tfa'])
      );
  }

  tfas(): Observable<Tfa[]> {
    return this._http.get(`${this._api}/users/${this._user.Oid}/tfas`)
      .pipe(
        map(response => response['Tfas'])
      );
  }

  activeTfas(email: string): Observable<Tfa[]> {
    return this._http.get(`${this._api}/users/${this._user.Oid}/activeTfas/${email}`)
      .pipe(
        map(response => response['ActiveTfas'])
      );
  }

}
