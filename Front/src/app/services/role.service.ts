import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  constructor(private _http: HttpClient) { }

  public getRoles() {
    return this._http.get('http://localhost:3000/api/roles').toPromise();
  }
}
