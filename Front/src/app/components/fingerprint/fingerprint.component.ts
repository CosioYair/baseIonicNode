import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-fingerprint',
  templateUrl: './fingerprint.component.html',
  styleUrls: ['./fingerprint.component.scss'],
})
export class FingerprintComponent implements OnInit {

  constructor(public alertController: AlertController) { }

  ngOnInit() {}

  public async verifyTouchAuth(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Login',
      message: 'Ingress your password to confirm:',
      inputs: [
        {
          name: 'password',
          placeholder: 'PASSWORD',
          type: 'password'
        }
      ]
    });

    return await alert.present();
  }
}
