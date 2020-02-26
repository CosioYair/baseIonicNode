import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', loadChildren: './login/login.module#LoginPageModule', canActivate: [] },
  { path: 'register', loadChildren: './register/register.module#RegisterPageModule', canActivate: [] },
  { path: 'new-password', loadChildren: './new-password/new-password.module#NewPasswordPageModule' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthRoutingModule { }
