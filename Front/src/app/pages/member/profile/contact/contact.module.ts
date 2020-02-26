import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ContactPage } from './contact.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { GooglePlaceModule } from 'ngx-google-places-autocomplete';
import { Ionic4DatepickerModule } from '@logisticinfotech/ionic4-datepicker';

const routes: Routes = [
  {
    path: '',
    component: ContactPage
  }
];

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule ,
    IonicModule,
    RouterModule.forChild(routes),
    ComponentsModule,
    GooglePlaceModule,
    ReactiveFormsModule,
    Ionic4DatepickerModule
  ],
  declarations: [ContactPage]
})
export class ContactPageModule { }
