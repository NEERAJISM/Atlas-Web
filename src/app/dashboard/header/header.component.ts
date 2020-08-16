import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class DashboardHeaderComponent {
  constructor(private router: Router, public dialog: MatDialog) {}

  openLogoutDialog() {
    const dialogRef = this.dialog.open(LogoutDialogComponent, {
      width: '300px',
    });

    dialogRef.afterClosed().subscribe((result) => {
    });
  }
}

// Logout Dialog

@Component({
  selector: 'app-logout-dialog',
  templateUrl: './logout-dialog.component.html',
})
export class LogoutDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<LogoutDialogComponent>,
    private router: Router
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickLogin() {
    this.router.navigateByUrl('');
    this.dialogRef.close();
  }
}
