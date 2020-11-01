import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FirebaseUtil } from '@core/firebaseutil';
import { Product } from '@core/models/product';
import { NewProductComponent } from './new/new.product.component';
import { RemoveProductComponent } from './remove/remove.product.component';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss'],
})
export class InventoryDashboardComponent implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  product: Product;
  dataSource: MatTableDataSource<Product>;
  displayedColumns: string[] = [
    'name',
    'serial',
    'unit',
    'price',
    'stock',
    'desc',
    'actions'
  ];

  constructor(public fbutil: FirebaseUtil, public dialog: MatDialog) {
    this.dataSource = new MatTableDataSource();
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  fetchProducts() {
    const result: Product[] = [];
    this.fbutil
      .getProductRef('bizId')
      .get()
      .forEach((res) =>
        res.forEach((data) => {
          const p = new Product();
          if (data.data()) {
            Object.assign(p, data.data());
            result.push(p);
          }
        })
      )
      .finally(() => this.update(result));
  }

  update(result: Product[]) {
    this.dataSource = new MatTableDataSource(result);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  addNewProduct() {
    this.dialog.open(NewProductComponent, {
      position: { top: '20px' },
    });

    this.dialog.afterAllClosed.subscribe(() => this.fetchProducts());
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(product: Product) {
    this.dialog.open(NewProductComponent, {
      data: product,
      position: { top: '20px' },
    });

    this.dialog.afterAllClosed.subscribe(() => this.fetchProducts());
  }

  removeProduct(product: Product) {
    this.dialog.open(RemoveProductComponent, {
      data: {
        id: product.id,
        name: product.name,
      },
    });

    this.dialog.afterAllClosed.subscribe(() => this.fetchProducts());
  }

  trimDescription(desc: string): string {
    if (desc && desc.length > 150) {
       return desc.substr(0, 150);
    }
    return desc;
  }
}
