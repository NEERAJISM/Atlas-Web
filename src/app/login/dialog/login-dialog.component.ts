import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
})
export class LoginDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickLogin() {
    this.router.navigateByUrl('/dashboard');
    this.dialogRef.close();
  }
}
