import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AuthService } from 'src/app/auth.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
})
export class LoginDialogComponent implements AfterViewInit {
  matcher = new MyErrorStateMatcher();
  emailFormControl = new FormControl('', [
    Validators.required,
    Validators.email,
  ]);

  hide = true;
  passwordFormControl = new FormControl('', [
    Validators.required,
    Validators.minLength(6)
  ]);

  email: string;
  pass: string;
  isForgotPassword: boolean = false;

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onClickLogin() {
    if (this.email && this.email.length > 0) {
      if (this.isForgotPassword) {
        this.auth.forgotPassword(this.email);
      } else if (this.pass && this.pass.length > 5) {
        this.auth.signIn(this.email, this.pass)
          .then(() =>this.dialogRef.close())
          .catch(() => console.log("login error"));
      }
    }
  }

  onClickRegister() {
    if (this.email && this.email.length > 0 && this.pass && this.pass.length > 5) {
      this.auth.signUp(this.email, this.pass);
    }
  }

  forgotPassword() {
    this.isForgotPassword = true;
  }

  backToLogin() {
    this.isForgotPassword = false;
  }
}
