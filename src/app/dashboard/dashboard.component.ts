import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';


import {
  MatDialogRef,
  MAT_DIALOG_DATA,
  MatDialog,
} from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

import {
  trigger,
  state,
  style,
  animate,
  transition,
} from '@angular/animations';

export interface MenuItem {
  name: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],

  animations: [
    trigger('openClose', [
      state(
        'open',
        style({})
      ),
      state(
        'closed',
        style({})
      ),
      transition('open => closed', [animate('1s')]),
      transition('closed => open', [animate('0.5s')]),
    ]),
  ],
})
export class DashboardComponent implements OnInit {
  title = 'atlas-dashboard';
  showFiller = false;

  showMenuName = false;

  menu: MenuItem[] = [
    {
      name: 'Dashboard',
      icon: 'fas fa-chart-pie mr-2',
      link: '/dashboard/main'
    },
    {
      name: 'Orders',
      icon: 'fas fa-boxes mr-2',
      link: '/dashboard/orders'
    },
    {
      name: 'Inventory',
      icon: 'fas fa-dolly-flatbed mr-2',
      link: '/dashboard/orders'
    },
    {
      name: 'Customer',
      icon: 'fas fa-users mr-2',
      link: '/dashboard/orders'
    },
    {
      name: '  Tax / GST',
      icon: 'fas fa-rupee-sign mr-2 ml-1',
      link: '/dashboard/orders'
    },
    {
      name: 'Support',
      icon: 'fas fa-headset mr-2',
      link: '/dashboard/orders'
    },
    {
      name: 'Help',
      icon: 'fas fa-info-circle mr-2',
      link: '/dashboard/orders'
    },
  ];

  constructor(private router: Router, public dialog: MatDialog) {}

  ngOnInit(): void {}

  logout() {
    this.router.navigateByUrl('/');
  }

  toggleMenu() {
    this.showMenuName = !this.showMenuName;
  }

  routeToAnotherView(){
    this.router.navigateByUrl('/dashboard/orders');
  }

  openLogoutDialog(){
    const dialogRef = this.dialog.open(LogoutDialog, {
      width: '300px',
      // data: { name: this.name, animal: this.animal },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      // this.animal = result;
    });
  }

}





// Dialog

@Component({
  selector: 'logout-dialog',
  templateUrl: './dashboard.component.dialog.html',
})
export class LogoutDialog {
  constructor(
    public dialogRef: MatDialogRef<LogoutDialog>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private route: ActivatedRoute,
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

