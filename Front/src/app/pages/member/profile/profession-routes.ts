import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'contact' },
  { path: 'contact', loadChildren: './contact/contact.module#ContactPageModule' }
];
