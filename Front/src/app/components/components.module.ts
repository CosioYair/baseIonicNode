import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { IonicModule } from '@ionic/angular';
import { FileUploaderComponent } from './file-uploader/file-uploader.component';
import { MenuComponent } from './menu/menu.component';
import { MenuButtonComponent } from './menu-button/menu-button.component';
import { RouterModule } from '@angular/router';
import { AlertComponent } from './alert/alert.component';

@NgModule({
  declarations: [
    HeaderComponent,
    FileUploaderComponent,
    MenuComponent,
    MenuButtonComponent,
    AlertComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule
  ],
  exports: [
    HeaderComponent,
    FileUploaderComponent,
    MenuComponent,
    MenuButtonComponent,
    AlertComponent
  ]
})
export class ComponentsModule { }
