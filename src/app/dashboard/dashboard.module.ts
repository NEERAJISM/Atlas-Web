import { NgModule } from '@angular/core';

import { CoreModule } from '../core/core.module';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';

import { ChartsModule } from 'ng2-charts';

import { PdfViewerModule } from 'ng2-pdf-viewer';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { DashboardComponent } from './dashboard.component';
import { DashboardHeaderComponent } from './header/header.component';
import { LogoutDialogComponent } from './header/header.component';

import { DashboardRoutingModule } from './dashboard-routing.module';

import { MainDashboardComponent } from './components/maindashboard/maindashboard.component';
import { InvoiceDashboardComponent } from './components/invoice/invoice.component';
import { EditInvoiceComponent } from './components/invoice/edit/editinvoice.component';
import { InventoryDashboardComponent } from './components/inventory/inventory.component';
import { CustomersDashboardComponent } from './components/customers/customers.component';
import { TaxDashboardComponent } from './components/tax/tax.component';
import { SupportDashboardComponent } from './components/support/support.component';

@NgModule({
  imports: [
    NgbModule,
    FormsModule,
    CoreModule,
    CommonModule,
    ChartsModule,
    PdfViewerModule,
    DashboardRoutingModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatSidenavModule,
    MatListModule,
    MatCardModule,
    MatBadgeModule,
    MatTooltipModule,
    MatMenuModule,
    MatDialogModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatSelectModule,
    MatAutocompleteModule,
    MatSnackBarModule
  ],
  declarations: [
    DashboardComponent,
    DashboardHeaderComponent,
    LogoutDialogComponent,
    MainDashboardComponent,
    InvoiceDashboardComponent,
    EditInvoiceComponent,
    InventoryDashboardComponent,
    CustomersDashboardComponent,
    TaxDashboardComponent,
    SupportDashboardComponent,
  ],
  exports: [
    DashboardComponent,
    DashboardHeaderComponent,
    LogoutDialogComponent,
    MainDashboardComponent,
    InvoiceDashboardComponent,
    EditInvoiceComponent,
    InventoryDashboardComponent,
    CustomersDashboardComponent,
    TaxDashboardComponent,
    SupportDashboardComponent,
  ],
})
export class DashboardModule {}
