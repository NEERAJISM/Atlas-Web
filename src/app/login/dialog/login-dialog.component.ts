import { AfterViewInit, ChangeDetectorRef, Component } from '@angular/core';
import { FormControl, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Constants } from '@core/constants';
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
  isForgotPassword = false;

  hasError = false;
  error = '';

  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private cdr: ChangeDetectorRef,
    private auth: AuthService
  ) { }

  ngAfterViewInit(): void {
    this.cdr.detectChanges();
  }

  onClickLogin() {
    this.hasError = false;

    if (!this.email || this.email.length === 0 || this.emailFormControl.hasError('email')) {
      this.hasError = true;
      this.error = 'Invalid Email Address!';
      return;
    }

    if (this.isForgotPassword) {
      this.auth.forgotPassword(this.email);
      return;
    }

    if (!this.pass || this.pass.length < 6) {
      this.hasError = true;
      this.error = 'Invalid Password!';
      return;
    }

    this.auth.signIn(this.email, this.pass)
      .then((x) => {
        if (Constants.SUCCESS === x) {
          this.dialogRef.close();
        } else {
          this.hasError = true;
          if (Constants.AUTH_NO_USER === x) {
            this.error = 'No account found for this e-mail, Please register!';
          } else if (Constants.AUTH_INVALID_PASSWORD === x) {
            this.error = 'Incorrect Password!';
          } else {
            this.error = x;
          }
        }
      });
  }

  onClickRegister() {
    if (this.email && this.email.length > 0 && this.pass && this.pass.length > 5) {
      this.auth.signUp(this.email, this.pass);
    }
  }

  forgotPassword() {
    this.isForgotPassword = true;
    this.hasError = false;
  }

  backToLogin() {
    this.isForgotPassword = false;
    this.hasError = false;
  }
}
