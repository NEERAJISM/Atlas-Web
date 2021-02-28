import { NgModule } from '@angular/core';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { FirebaseUtil } from './firebaseutil';
import { SplashComponent } from './splash/splash.component';
import { CommonUtil } from './common.util';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [AngularFirestoreModule.enablePersistence(), MatSnackBarModule],
  declarations: [SplashComponent],
  exports: [SplashComponent],
  providers: [FirebaseUtil, CommonUtil],
})
export class CoreModule {}
