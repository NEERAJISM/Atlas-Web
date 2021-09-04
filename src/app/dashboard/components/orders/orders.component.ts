import { Component } from '@angular/core';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersDashboardComponent {

  new = 0;
  accept = 0;
  progress = 0;
  transit = 0;
  completed = 0
  allOrders = 0;

}
