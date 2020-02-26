import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Validators, FormControl, FormGroup } from '@angular/forms';
import { GooglePlaceDirective } from 'ngx-google-places-autocomplete';
import { emptyValidator } from 'src/app/validators/empty-validator';
import { dateLocale, dateLocaleOptions, datePickerOptions } from 'src/app/shared/datePickerConfig';
import { LanguageConfig } from 'src/app/language-config';
import { AlertOptions } from 'src/app/interfaces/alert-options';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { Store } from '@ngrx/store';
import * as fromStore from 'src/app/store/reducers';
import * as fromProfile from '../store/reducers';
import { userActions, authActions } from 'src/app/store/actions';
import { genderActions } from '../store/actions';
import { User } from 'src/app/interfaces/user';
import { Process } from 'src/app/interfaces/process';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { UploaderOptions } from 'src/app/interfaces/uploader-options';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit, OnDestroy {

  public accountTypes: any = [];
  public genders: any = [];
  public form: FormGroup;
  public random: number = Math.random();
  public user: User;
  public datePickerObj: any;
  private _minDate: Date;
  private _updateAlert: AlertOptions = <AlertOptions>{};
  public languageConfig: LanguageConfig = new LanguageConfig();
  public alertOptionsDomicile: AlertOptions = <AlertOptions>{};
  private _jwt: string = '';
  public _decodedJwt: DecodedJwt = <DecodedJwt>{};
  public getAppLanguage$: Observable<Language>;
  private _appLanguage: Language;
  private _pendingProcess: Process;
  public userProfileImg: File;
  private _subscriptions: Subscription[] = [];
  public uploaderOptions: UploaderOptions;

  @ViewChild('placesRef', { read: false, static: false }) placesRef: GooglePlaceDirective;

  constructor(private _store: Store<fromProfile.AppState>) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this._minDate = new Date();
    this._minDate.setFullYear(this._minDate.getFullYear() - 18);
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.form = new FormGroup({
      Name: new FormControl(null, [
        Validators.required,
        emptyValidator()
      ]),
      Birthdate: new FormControl(null, [
        Validators.required
      ]),
      NumExt: new FormControl(null, [
        Validators.required
      ]),
      NumInt: new FormControl(null, [
        Validators.pattern(/^\d+$/),
        Validators.maxLength(6)
      ]),
      Suburb: new FormControl(null, [
        Validators.required
      ]),
      Street: new FormControl(null, [
        Validators.required
      ]),
      Town: new FormControl(null, [
        Validators.required
      ]),
      State: new FormControl(null, [
        Validators.required
      ]),
      Country: new FormControl(null, [
        Validators.required
      ]),
      PostalCode: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(5),
        Validators.minLength(5)
      ]),
      Gender: new FormControl(1, [
        Validators.required
      ]),
      Phone: new FormControl(null, [
        Validators.required,
        Validators.pattern(/^\d+$/),
        Validators.maxLength(10),
        Validators.minLength(10),
      ]),
    });
  }

  ngOnInit() {
    this._subscriptions.push(
      this.getAppLanguage$.subscribe(appLanguage => { this._appLanguage = appLanguage; }),
      this._store.select(fromStore.getAuthAlert, { actionType: userActions.UPDATE_USER }).subscribe(updateAlert => {
        this._updateAlert = updateAlert;
      }),
      this._store.select(fromStore.getUserFile, { fileType: 4 }).subscribe(userFile => {
        this.random = Math.random();
        this.userProfileImg = userFile;
      }),
      this._store.select(fromProfile.getGenders).subscribe(genders => { this.genders = genders; }),
      this._store.select(fromStore.getUserInfo).subscribe(user => {
        if (user.Oid) {
          this.user = { ...user };
          const userForm = { ...this.user };
          this.user.Phone = this.user.Phone ? JSON.parse(this.user.Phone) : this.user.Phone;
          // tslint:disable-next-line: max-line-length
          const birthdate = this.user.Birthdate ? new Date(this.user.Birthdate).toLocaleDateString(dateLocale, dateLocaleOptions) : new Date(this._minDate).toLocaleDateString(dateLocale, dateLocaleOptions);
          userForm.Birthdate = birthdate;
          userForm.Gender = userForm.Gender ? userForm.Gender : 1;
          this.form.patchValue(userForm);
        }
      }),
      // tslint:disable-next-line: max-line-length
      this._store.select(fromStore.getPendingProcesses).subscribe(pendingProcesses => {
        this._pendingProcess = pendingProcesses.CompleteRegister ? pendingProcesses.CompleteRegister[0] : <Process>{};
        if (this._pendingProcess.Finished) {
          // this._router.navigate(['/']);
        }
      }),
      this._store.select(fromStore.getJwt).subscribe(jwt => { this._jwt = jwt; }),
      this._store.select(fromStore.getDecodeJwt).subscribe(decodedJwt => { this._decodedJwt = decodedJwt; }),
    );
    if (this.genders.length === 0) {
      this.getGenders();
    }
    this.alertOptionsDomicile.Type = 'danger';
    this.alertOptionsDomicile.Message = this.languageConfig[this._appLanguage.Code].inputs.errors.domicile;
    this.datePickerObj = { ...datePickerOptions(this._appLanguage.Code), toDate: this._minDate };
    this.uploaderOptions = {
      FileKey: 'userImage',
      FileName: `${this.user.Email}`,
      Token: this._jwt,
      MimeType: 'image/png',
      UploadUrl: `http://localhost:3000/api/shared/uploadUserImage/${this.user.Oid}`,
      ResponseKey: 'fullPath',
      ButtonText: 'Upload Picture',
      LoadAction: new userActions.LoadFiles({ userOid: this.user.Oid })
    };
  }

  ngOnDestroy() {
    if (this._updateAlert) {
      this._store.dispatch(new authActions.RemoveAuthAlert({ action: userActions.UPDATE_USER }));
    }
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  handleAddressChange(address: any) {
    const addressComponents = address.address_components;
    let country = addressComponents.find(component => component.types.includes('country'));
    let state = addressComponents.find(component => component.types.includes('administrative_area_level_1'));
    let city = addressComponents.find(component => component.types.includes('locality'));
    let street = addressComponents.find(component => component.types.includes('route'));
    let streetNumber = addressComponents.find(component => component.types.includes('street_number'));
    let suburb = addressComponents.find(component => component.types.includes('sublocality_level_1'));
    let zipCode = addressComponents.find(component => component.types.includes('postal_code'));
    if (country && state && city && street && streetNumber && zipCode) {
      country = country.long_name;
      state = state.long_name;
      city = city.long_name;
      zipCode = zipCode.short_name;
      suburb = suburb ? suburb.short_name : '';
      street = street.short_name;
      streetNumber = streetNumber.short_name;
      this.setAddressForm(country, state, city, zipCode, suburb, street, streetNumber);
      this.alertOptionsDomicile.Status = false;
    } else {
      this.alertOptionsDomicile.Status = true;
    }
  }

  setAddressForm(country, state, city, zipCode, suburb, street, streetNumber) {
    this.setFormValue('Country', country);
    this.setFormValue('State', state);
    this.setFormValue('Town', city);
    this.setFormValue('PostalCode', zipCode);
    this.setFormValue('Suburb', suburb);
    this.setFormValue('Street', street);
    this.setFormValue('NumExt', streetNumber);
  }

  setFormValue(key: string, value: string) {
    this.form.controls[key].setValue(value);
  }

  getGenders() {
    this._store.dispatch(new genderActions.LoadGenders({ languageId: this._appLanguage.Id.toString() }));
  }

  async updateProfile() {
    const user: User = { ...this.form.value };
    user.Oid = this.user.Oid;
    user.Birthdate = new Date(user.Birthdate);
    this._store.dispatch(new userActions.UpdateUser({
      oid: user.Oid,
      user,
      finishedProcessOid: this._pendingProcess.Oid
    }));
  }

  get mainForm() { return this.form.controls; }
}
