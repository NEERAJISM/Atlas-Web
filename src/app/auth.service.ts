import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Constants } from '@core/constants';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  userData: any = null;

  constructor(
    public afs: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone
  ) {
    this.authSubscription();
  }

  authSubscription(){
    /* Saving user data in localstorage when logged in and setting up null when logged out */
    this.afAuth.authState.subscribe(user => {
      this.userData = user;
      if (this.userData) {
        // localStorage.setItem('user', JSON.stringify(this.userData));
        // JSON.parse(localStorage.getItem('user'));
      } else {
        this.router.navigateByUrl('');
        // localStorage.setItem('user', null);
        // JSON.parse(localStorage.getItem('user'));
      }
    });
  }

  // Sign in with email/password
  signIn(email, password) {
    return this.afAuth.signInWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/dashboard');
        });
        return Constants.SUCCESS;
        // this.setUserData(result.user);
      }).catch((error) => {
        return error.code;
      });
  }

  // Sign up with email/password
  signUp(email: string, password: string) {
    return this.afAuth.createUserWithEmailAndPassword(email, password)
      .then((result) => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/dashboard');
        });
        return Constants.SUCCESS;
        // result.user.sendEmailVerification()
        //   .catch((error) => {
        //     window.alert(error.message);
        //   });
        // this.setUserData(result.user);
      }).catch((error) => {
        return error.code;
      });
  }

  // Reset Forgot password
  forgotPassword(passwordResetEmail) {
    return this.afAuth.sendPasswordResetEmail(passwordResetEmail)
      .then(() => {
        window.alert('Password reset email sent, check your inbox.');
      }).catch((error) => {
        window.alert(error)
      });
  }

  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    return (this.userData !== null);
    // const user = JSON.parse(localStorage.getItem('user'));
    // return (user !== null && user.emailVerified !== false) ? true : false;
  }

  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  setUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    }
    return userRef.set(userData, {
      merge: true
    });
  }

  signOut() {
    this.userData = null;
    return this.afAuth.signOut().then(() => {
      // localStorage.removeItem('user');
    }).finally(() => this.router.navigateByUrl(''));
  }

}
