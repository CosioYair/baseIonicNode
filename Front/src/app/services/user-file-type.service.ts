import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { File } from '../interfaces/file';

@Injectable({
  providedIn: 'root'
})
export class UserFileTypeService {

  private _api: String = 'http://localhost:3000/api';
  constructor(private _http: HttpClient) { }

  getAll() {
    return this._http.get(`${this._api}/userfiletypes`)
    .pipe(
      map(response => response['Files'])
    );
  }

  getByUser(userOid: string): Observable<File[]> {
    return this._http.get(`${this._api}/userfiletypes/${userOid}`)
    .pipe(
      map(response => response['Files'])
    );
  }
}
