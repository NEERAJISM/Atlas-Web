import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MainDashboardComponent } from './components/maindashboard/maindashboard.component';
import { OrdersDashboardComponent } from './components/orders/orders.component';
import { DashboardComponent } from './dashboard.component';
import { InvoiceDashboardComponent } from './components/invoice/invoice.component';

const aboutRoutes: Routes = [
  {
      path: '',
      component: DashboardComponent,
      children: [
        {
            path: '',
            redirectTo: 'main',
            pathMatch: 'full'
        },
        {
            path: 'main',
            component: MainDashboardComponent,
        },
        {
            path: 'orders',
            component: OrdersDashboardComponent,
        },
        {
            path: 'invoice',
            component: InvoiceDashboardComponent,
        },
        {
            path: '**',
            redirectTo: 'main',
        }
      ]
  }
];

@NgModule({
    imports: [RouterModule.forChild(aboutRoutes)],
    exports: [RouterModule]
})
export class DashboardRoutingModule {}
