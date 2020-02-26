import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './security/guards/auth.guard';
import { IsNoAuthGuard } from './security/guards/is-no-auth.guard';

const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', loadChildren: './pages/home/home.module#HomePageModule', canActivate: [] },
  { path: 'auth', loadChildren: './pages/auth/auth.module#AuthModule', canActivate: [IsNoAuthGuard] },
  { path: 'member', loadChildren: './pages/member/member.module#MemberModule', canActivate: [AuthGuard] },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
