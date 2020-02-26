import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';

import { IonicModule } from '@ionic/angular';

import { ProfilePage } from './profile.page';
import { ComponentsModule } from 'src/app/components/components.module';
import * as ProfessionRoutes from './profession-routes';
import { StoreModule } from '@ngrx/store';
import { profileReducers } from './store/reducers';
import { EffectsModule } from '@ngrx/effects';
import { ProfileEffects } from './store/effects';

const routes: Routes = [
  {
    path: '',
    component: ProfilePage,
    children: ProfessionRoutes.routes
  }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ComponentsModule,
    RouterModule.forChild(routes),
    StoreModule.forFeature('profile', profileReducers),
    EffectsModule.forFeature(ProfileEffects),
  ],
  declarations: [ProfilePage]
})
export class ProfilePageModule { }
