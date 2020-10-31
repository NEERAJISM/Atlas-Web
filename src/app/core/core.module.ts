import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseUtil } from './firebaseutil';
import { PageNotFoundComponent } from './pagenotfound/pagenotfound.component';
import { SplashComponent } from './splash/splash.component';
import { CommonUtil } from './common.util';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [AngularFirestoreModule, MatSnackBarModule],
  declarations: [SplashComponent, PageNotFoundComponent],
  exports: [SplashComponent, PageNotFoundComponent],
  providers: [FirebaseUtil, CommonUtil],
})
export class CoreModule {}
