import { NgModule } from '@angular/core';
import { SplashComponent } from './splash/splash.component';
import { FirebaseUtil } from './firebaseutil';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';

import { AngularFirestoreModule } from '@angular/fire/firestore';

@NgModule({
  imports: [
    AngularFirestoreModule
  ],
  declarations: [
    SplashComponent,
    PageNotFoundComponent,
  ],
  exports: [
    SplashComponent,
    PageNotFoundComponent,
  ],
  providers: [
    FirebaseUtil
  ]
})
export class CoreModule {}