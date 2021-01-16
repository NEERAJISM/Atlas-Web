import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FirebaseUtil } from '@core/firebaseutil';
import { InvoicePreview } from '@core/models/invoice.preview';
import { Subscription } from 'rxjs';
import { InvoiceService } from './invoice.service';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceDashboardComponent  implements AfterViewInit, OnDestroy {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  invoice: InvoicePreview;
  dataSource: MatTableDataSource<InvoicePreview>;
  subscription: Subscription;
  displayedColumns: string[] = [
    'invoiceNo',
    'client',
    'address',
    'amount',
    'invoiceDate',
    'dueDate',
    'lastUpdate',
    'actions',
  ];

  constructor(private fbutil: FirebaseUtil, private router: Router, private invoiceService: InvoiceService) {
    this.dataSource = new MatTableDataSource();
    this.subscribeToUpdates();
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  subscribeToUpdates() {
    this.subscription = this.fbutil
      .getInvoicePreviewRef('bizId')
      .snapshotChanges()
      .subscribe(() => {
        this.fetchInvoicePreviews();
      });
  }

  fetchInvoicePreviews() {
    const result: InvoicePreview[] = [];
    this.fbutil
      .getInvoicePreviewRef('bizId')
      .get()
      .forEach((res) =>
        res.forEach((data) => {
          const c = new InvoicePreview();
          if (data.data()) {
            Object.assign(c, data.data());
            result.push(c);
          }
        })
      )
      .finally(() => this.update(result));
  }

  update(result: InvoicePreview[]) {
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  loadNewInvoiceComponent() {
    this.invoiceService.invoiceId = 'artTETzm73iPUQ77cPyY';
    this.router.navigateByUrl('/dashboard/invoice/edit');
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDateString(date: number){
    const d = new Date(date);
    return d.toLocaleString();
  }

  preview(invoice){

  }

  edit(invoice){

  }
}
