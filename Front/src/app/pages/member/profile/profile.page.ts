import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LanguageConfig } from 'src/app/language-config';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { Observable, Subscription } from 'rxjs';
import { Language } from 'src/app/interfaces/language';
import { DecodedJwt } from 'src/app/interfaces/decoded-jwt';
import { Process } from 'src/app/interfaces/process';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit, OnDestroy {

  public userData: any;
  public languageConfig: LanguageConfig = new LanguageConfig();
  public processesFinished: Boolean[] = [];
  public getDecodedJwt$: Observable<DecodedJwt>;
  public getAppLanguage$: Observable<Language>;
  private _subscriptions: Subscription[] = [];

  constructor(private _store: Store<AppState>,
    private _router: Router) {
    this.getAppLanguage$ = this._store.select(fromStore.getAppLanguage);
    this.getDecodedJwt$ = this._store.select(fromStore.getDecodeJwt);
  }

  ngOnInit() {
    this._subscriptions.push(
      this._store.select(fromStore.getPendingProcess, { process: 'CompleteRegister'}).subscribe(pendingProcess => {
        if(pendingProcess) {
          this.setFinishedRegisterProcesses(pendingProcess);
        }
      })
    );
    this.setInicialTab();
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  setFinishedRegisterProcesses(processes: Process[]) {
    if (processes) {
      this.processesFinished = processes.map(process => process.Finished);
    } else {
      this.processesFinished = [];
    }
  }

  setInicialTab() {
    if (this.processesFinished.length > 0) {
      if (this.processesFinished[0]) {
        this._router.navigate(['/member/profile/profession']);
      }
      if (this.processesFinished[1]) {
        this._router.navigate(['/member/profile/experience']);
      }
      if (this.processesFinished[2]) {
        this._router.navigate(['/member/profile/education']);
      }
    }
  }

}
