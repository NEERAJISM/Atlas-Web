import { NgModule } from '@angular/core';
import { SplashComponent } from './splash/splash.component';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

@NgModule({
  imports: [],
  declarations: [
    SplashComponent,
    PageNotFoundComponent,
  ],
  exports: [
    SplashComponent,
    PageNotFoundComponent,
  ],
})
export class CoreModule {}