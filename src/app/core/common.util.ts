import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CommonUtil {
  constructor(private snackBar: MatSnackBar) { }

  showSnackBar(message: string, dur?: number) {
    this.snackBar.open(message, 'Close', {
      duration: dur ? dur : 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
