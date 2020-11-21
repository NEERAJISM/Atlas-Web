import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SplashComponent } from './core/splash/splash.component';
import { PageNotFoundComponent } from './core/pagenotfound/pagenotfound.component';

const routes: Routes = [
  // TODO default goto page + secure all links
  {
    path: '',
    component: LoginComponent,
    pathMatch: 'full'
  },
  {
    path: 'splash',
    component: SplashComponent,
  },
  {
    path: 'dashboard',
    loadChildren: () => import(`./dashboard/dashboard-routing.module`).then(m => m.DashboardRoutingModule)
  },
  {
    // Always keep this in the END
    path: '**',
    component: PageNotFoundComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
