import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { FilePath } from '@ionic-native/file-path/ngx';
import { HttpClient } from '@angular/common/http';
import { Platform } from '@ionic/angular';
import { UploaderOptions } from 'src/app/interfaces/uploader-options';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import * as fromStore from 'src/app/store/reducers';
import { userActions } from 'src/app/store/actions';
import { Subscription } from 'rxjs';
import { User } from 'src/app/interfaces/user';

@Component({
  selector: 'app-file-uploader',
  templateUrl: './file-uploader.component.html',
  styleUrls: ['./file-uploader.component.scss'],
})
export class FileUploaderComponent implements OnInit, OnDestroy {

  private _fileTransfer: FileTransferObject;
  private _file: File;
  public isCordova: boolean;
  public _jwt: string;
  public user: User = <User>{};
  private _subscriptions: Subscription[] = [];

  @Input() fileType: string;
  @Input() options: UploaderOptions;
  @Output() fileUploaded = new EventEmitter();

  // tslint:disable-next-line: deprecation
  constructor(private _transfer: FileTransfer,
    private _filePath: FilePath,
    private _fileChooser: FileChooser,
    private _http: HttpClient,
    private _platform: Platform,
    private _store: Store<AppState>) {
    this.isCordova = this._platform.is('cordova');
  }

  ngOnInit() {
    this._subscriptions.push(
      this._store.select(fromStore.getUserInfo).subscribe(user => { this.user = user; }),
      this._store.select(fromStore.getJwt).subscribe(jwt => { this._jwt = jwt; }),
    );
  }

  ngOnDestroy() {
    this._subscriptions.forEach(subscription => subscription.unsubscribe());
  }

  onFileChanged(event) {
    this._file = event.target.files[0];
    this.uploadWebFile();
  }

  uploadWebFile() {
    const uploadData = new FormData();
    uploadData.append(this.options.FileKey, this._file, this.options.FileName);
    this._http.post(this.options.UploadUrl, uploadData, {
      params: {
        FileType: this.fileType
      }
    }).toPromise().then(response => {
      if (this.options.LoadAction) {
        setTimeout(() => {
          this._store.dispatch(this.options.LoadAction);
        }, 100);
      }
      this.fileUploaded.emit(response[this.options.ResponseKey]);
    });
  }

  uploadNativeFile() {
    this._fileChooser.open().then(uri => {
      this._filePath.resolveNativePath(uri).then(nativePath => {
        this._fileTransfer = this._transfer.create();
        const options: FileUploadOptions = {
          fileKey: this.options.FileKey,
          fileName: this.options.FileName,
          headers: {
            Authorization: `Bearer ${this.options.Token}`
          },
          mimeType: this.options.MimeType,
          params: {
            FileType: this.fileType
          }
        };
        this._fileTransfer.upload(nativePath, this.options.UploadUrl, options, true).then(data => {
          if (this.options.LoadAction) {
            setTimeout(() => {
              this._store.dispatch(this.options.LoadAction);
            }, 100);
          }
          this.fileUploaded.emit(data.response[this.options.ResponseKey]);
        });
      });
    });
  }

}
