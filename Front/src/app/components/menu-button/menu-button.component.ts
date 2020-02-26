import { Component, OnInit, Input } from '@angular/core';
import { MenuController } from '@ionic/angular';

@Component({
  selector: 'app-menu-button',
  templateUrl: './menu-button.component.html',
  styleUrls: ['./menu-button.component.scss'],
})
export class MenuButtonComponent implements OnInit {

  @Input() menuId: string;
  @Input() icon: string;

  constructor(private _menuCtrl: MenuController) { }

  ngOnInit() { }

  toggleMenu() {
    this._menuCtrl.toggle(this.menuId);
  }

}
