import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
      state('open', style({})),
      state('closed', style({})),
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
      link: '/dashboard/main',
    },
    {
      name: 'Biiling / Invoice',
      icon: 'fas fa-boxes mr-2',
      link: '/dashboard/invoice',
    },
    {
      name: 'Inventory',
      icon: 'fas fa-dolly-flatbed mr-2',
      link: '/dashboard/inventory',
    },
    {
      name: 'Customer',
      icon: 'fas fa-users mr-2',
      link: '/dashboard/customers',
    },
    {
      name: '  Tax / GST',
      icon: 'fas fa-rupee-sign mr-2 ml-1',
      link: '/dashboard/tax',
    },
    {
      name: 'Business Profile',
      icon: 'fas fa-globe-americas mr-2 ml-1',
      link: '/dashboard/tax',
    },
    {
      name: 'Help / Support',
      icon: 'fas fa-headset mr-2',
      link: '/dashboard/support',
    }
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {}

  toggleMenu() {
    this.showMenuName = !this.showMenuName;
  }
}
