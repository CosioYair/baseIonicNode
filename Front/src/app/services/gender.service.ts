import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class GenderService {

  constructor(private _http: HttpClient) {
  }

  public getGenders(languageId: string) {
    return this._http.get('http://localhost:3000/api/genders', {
      params: {
        LanguageId: languageId
      }
    }).pipe(
      map(response => response['Genders'])
    );
  }
}
