import { NgModule } from '@angular/core';

import { FirebaseUtil } from './firebaseutil';
import { AngularFirestoreModule } from '@angular/fire/firestore';

import { CommonUtil } from './common.util';
import { SplashComponent } from './splash/splash.component';
import { SpinnerComponent } from './spinner/spinner.component';

import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@NgModule({
  imports: [
    AngularFirestoreModule.enablePersistence(),
    MatSnackBarModule,
    MatProgressSpinnerModule
  ],
  declarations: [SplashComponent, SpinnerComponent],
  exports: [SplashComponent, SpinnerComponent],
  providers: [FirebaseUtil, CommonUtil],
})
export class CoreModule { }
