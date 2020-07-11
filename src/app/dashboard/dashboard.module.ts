import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';


import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

import { MainDashboardComponent } from './components/maindashboard/maindashboard.component';
import { OrdersDashboardComponent } from './components/orders/orders.component';



@NgModule({
  imports: [
    NgbModule,
    CoreModule,
    CommonModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
  ],
  declarations: [
    DashboardComponent,
    MainDashboardComponent,
    OrdersDashboardComponent
  ],
  exports: [
    DashboardComponent,
    MainDashboardComponent,
    OrdersDashboardComponent
  ],
})
export class DashboardModule {}
