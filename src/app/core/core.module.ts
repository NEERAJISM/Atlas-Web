import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseUtil } from './firebaseutil';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { SplashComponent } from './splash/splash.component';

@NgModule({
  imports: [AngularFirestoreModule],
  declarations: [SplashComponent, PageNotFoundComponent],
  exports: [SplashComponent, PageNotFoundComponent],
  providers: [FirebaseUtil],
})
export class CoreModule {}
