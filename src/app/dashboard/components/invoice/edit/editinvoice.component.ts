import { Component } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonUtil } from '@core/common.util';
import { Constants } from '@core/constants';
import { FirebaseUtil } from '@core/firebaseutil';
import { Address } from '@core/models/address';
import { Client } from '@core/models/client';
import { Item } from '@core/models/invoice';
import { Product, Unit } from '@core/models/product';
import { jsPDF, jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './editinvoice.component.html',
  styleUrls: ['./editinvoice.component.scss'],
})
export class EditInvoiceComponent {
  // Invoice Dates
  invoiceDate: Date = new Date();
  dueDate: Date = new Date();

  // Client Section
  clientPreview = 'Customer Details';
  clientDefault = 'Customer Details';
  combinedAddress = '';

  clients: Client[] = [];
  clientControl: FormControl = new FormControl();
  clientObservable: Observable<Client[]>;

  client: Client = new Client();
  shippingAddress: Address = new Address();

  controls: FormControl[] = [];
  unitControls: FormControl[] = [];

  productUnitMap: Map<string, Unit[]> = new Map();

  observables: Observable<Product[]>[] = [];
  unitObservables: Observable<Unit[]>[] = [];

  optionsProduct: Product[] = [];

  optionsTax: string[] = [
    '0% (Tax-Exempt)',
    '5% (2.5% SGST + 2.5% CGST)',
    '12% (6% SGST + 6% CGST)',
    '18% (9% SGST + 9% CGST)',
    '28% (14% SGST + 14% CGST)',
  ];
  optionsTaxValue: number[] = [0, 0.05, 0.12, 0.18, 0.28];

  open = true;

  states = Constants.states;

  supplyPlace = '';
  supplyState = '';
  items: Item[] = [];
  data = [];

  /////////////////////////////////////////////////////////////////

  title = 'jspdf-autotable-demo';
  headOwnerAddress = [['Krishna Borewell']];
  dataOwnerAddress = [
    ['C\\o Balkrishna Patidar, Gamda Brahmaniya'],
    ['Sagwara, Dungarpur (Raj) - 314025'],
    ['Email : 8patidarneeraj@gmail.com'],
    ['Mob : +91 - 8877073059'],
  ];

  headInvoiceDtailsDefault = [['Invoice # 1254-5621']];
  dataInvoiceDtailsDefault = [
    ['Issue Date     : '],
    ['Due   Date     : '],
    ['Supply Place : '],
    ['Supply State : '],
  ];

  headInvoiceDtails = [['Invoice # 1254-5621']];
  dataInvoiceDtails = [
    ['Issue Date     : '],
    ['Due   Date     : '],
    ['Supply Place : '],
    ['Supply State : '],
  ];

  headSellerAddress = [
    ['Customer Name', 'Billing Address', 'Shipping Address'],
  ];

  dataSellerAddress = [
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', ''],
    ['', '', '', '']
  ];

  bodyTotal = [
    ['Total Amount', '14,000.0'],
    ['Tax (SGST + CGST)', '945.0 (@18%)'],
    [
      'Final Amount (Total + Tax)',
      '11,033.0\n(Eleven Thousand Thirty-three Rupees Only)',
    ],
  ];

  head = [
    [
      'No.',
      'Item Description (Unit)',
      'Code',
      'Qty',
      'Price',
      'Total',
      'Discount',
      'Tax / GST',
      'Total (Inc. Tax)',
    ],
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fbutil: FirebaseUtil,
    private util: CommonUtil
  ) {
    this.fetchClients();
    this.fetchProducts();
  }

  fetchClients() {
    const result: Client[] = [];
    this.fbutil
      .getClientRef('bizId')
      .get()
      .forEach((res) =>
        res.forEach((data) => {
          const c = new Client();
          if (data.data()) {
            Object.assign(c, data.data());
            result.push(c);
          }
        })
      )
      .finally(() => this.updateClients(result));
  }

  updateClients(c: Client[]) {
    this.clients = c;

    this.clientControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
        this.client = new Client();
        this.client.name = value;
      }
    });

    this.clientObservable = this.clientControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this.clients.filter((option) =>
          option.name
            .toLowerCase()
            .includes(
              typeof value === 'string'
                ? value.toLowerCase()
                : value.name.toLowerCase()
            )
        )
      )
    );
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
      .finally(() => this.updateProducts(result));
  }

  updateProducts(p: Product[]) {
    this.optionsProduct = p;
    this.productUnitMap.clear();
    p.forEach((product) =>
      this.productUnitMap.set(product.name.toLowerCase(), product.units)
    );
    this.addItem();
  }

  goBackToInvoiceComponent() {
    this.router.navigateByUrl('/dashboard/invoice');
  }

  addItem() {
    if (this.open && this.items.length >= 1) {
      this.expansionClosed();
    }

    if (this.validateItems()) {
      this.util.showSnackBar('New item added!', 'Dismiss');
      const item = new Item();
      item.qty = 1;
      item.discount = 0;
      item.tax = this.optionsTax[0];
      this.items.push(item);
      this.addFormControl();
    } else {
      this.util.showSnackBar('Please enter valid values', 'Dismiss');
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.controls.splice(index, 1);
    this.observables.splice(index, 1);
    this.unitObservables.splice(index, 1);
    this.unitControls.splice(index, 1);
  }

  addFormControl() {
    const myControl = new FormControl();
    const unitControl = new FormControl();
    const filteredOptions: Observable<Product[]> = myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(this.optionsProduct, value))
    );

    this.controls.push(myControl);
    this.observables.push(filteredOptions);
    this.unitObservables.push(undefined);
    this.unitControls.push(unitControl);
  }

  productSelected(value: string, index: number) {
    if (value) {
      const units: Unit[] = this.productUnitMap.get(value.toLowerCase());

      const filteredOptions: Observable<Unit[]> = this.unitControls[
        index
      ].valueChanges.pipe(
        startWith(''),
        map((value) => this._filterUnit(units, value))
      );

      this.unitObservables[index] = filteredOptions;

      // Added validaton to have atleast 1 unit
      this.items[index].unit = units[0].unit;
      this.items[index].price = units[0].price;
    }
  }

  unitSelected(value: string, index: number) {
    const item = this.items[index];
    this.productUnitMap.get(item.name.toLowerCase()).forEach((unit) => {
      if (unit.unit === value) {
        item.price = unit.price;
      }
    });
  }

  private _filter(list: any[], value: string): Product[] {
    return list.filter((option) =>
      option.name.toLowerCase().includes(value.toLowerCase())
    );
  }

  private _filterUnit(list: any[], value: string): Unit[] {
    return list.filter((option) =>
      option.unit.toLowerCase().includes(value.toLowerCase())
    );
  }

  calculate(item: Item): number {
    item.taxValue = 0;
    item.total =
      Math.abs(item.qty) * Math.abs(item.price) - Math.abs(item.discount);

    const index = this.optionsTax.indexOf(item.tax);
    if (index !== -1) {
      item.taxValue =
        Math.round(
          (item.total * this.optionsTaxValue[index] + Number.EPSILON) * 100
        ) / 100;
    }

    item.total += item.taxValue;
    return item.taxValue;
  }

  calculateTotalTax(): number {
    let total = 0;
    this.items.forEach((item) => {
      if (item.taxValue) {
        total += item.taxValue;
      }
    });
    return total;
  }

  calculateTotal(): number {
    let total = 0;
    this.items.forEach((item) => {
      if (item.total) {
        total += item.total;
      }
    });
    return total;
  }

  validateItems(): boolean {
    for (const item of this.items) {
      if (
        item.name &&
        item.unit &&
        item.price &&
        item.qty &&
        item.tax &&
        item.total
      ) {
        continue;
      } else {
        return false;
      }
    }
    return true;
  }

  isValidInvoice(): boolean {
    if (
      this.invoiceDate &&
      this.dueDate &&
      this.supplyState.length > 0 &&
      this.supplyPlace.length > 0 &&
      this.client &&
      this.client.name &&
      this.client.name.length > 0 &&
      this.client.mobile &&
      this.client.address &&
      this.client.address.line1 &&
      this.client.address.line1.length > 0 &&
      this.client.address.district &&
      this.client.address.district.length > 0 &&
      this.client.address.state &&
      this.client.address.state.length > 0 &&
      this.client.address.pin
    ) {
      return this.validateItems();
    }
    return false;
  }

  public generatePDF(): jsPDF {
    const options: jsPDFOptions = {};
    options.compress = true;
    const doc: jsPDF = new jsPDF(options);

    // TODO remove all comments
    // Comes from settings Icon - default is colorful backfround with initials
    // Icon / logo creator - font + color or photo
    doc.addImage('../../assets/icons/atlas-small.png', 'PNG', 7, 12, 17, 17);

    // setup
    (doc as any).autoTable({
      startY: 9,
      head: this.headOwnerAddress,
      body: this.dataOwnerAddress,
      theme: 'plain',
      margin: { left: 27 },
      headStyles: { fontSize: '12', textColor: '#01579b' },
      styles: {
        cellWidth: 95,
        fontSize: '10',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    this.dataInvoiceDtails[0][0] = this.dataInvoiceDtailsDefault[0][0] + this.getFormattedDate(this.invoiceDate);
    this.dataInvoiceDtails[1][0] = this.dataInvoiceDtailsDefault[1][0] + this.getFormattedDate(this.dueDate);

    this.dataInvoiceDtails[2][0] += this.supplyPlace;
    this.dataInvoiceDtails[3][0] += this.supplyState;

    this.dataSellerAddress[0][0] = this.client.name;
    this.dataSellerAddress[1][0] = 'PAN : ' + (this.client.gst ? this.client.gst : '');
    this.dataSellerAddress[2][0] = 'Email : ' + (this.client.email ? this.client.email : '');
    this.dataSellerAddress[3][0] = 'Mobile : ' + (this.client.mobile ? '+91 - ' + this.client.mobile : '');

    this.dataSellerAddress[0][1] = this.client.address.line1 ? this.client.address.line1 : '';
    this.dataSellerAddress[1][1] = this.client.address.line2 ? this.client.address.line2 : '';
    this.dataSellerAddress[2][1] = this.client.address.district + ' - ' + this.client.address.pin;
    this.dataSellerAddress[3][1] = this.client.address.state;

    this.dataSellerAddress[0][2] = this.shippingAddress.line1 ? this.shippingAddress.line1 : '';
    this.dataSellerAddress[1][2] = this.shippingAddress.line2 ? this.shippingAddress.line2 : '';
    this.dataSellerAddress[2][2] = this.shippingAddress.district + ' - ' + this.shippingAddress.pin;
    this.dataSellerAddress[3][2] = this.shippingAddress.state;

    (doc as any).autoTable({
      startY: 9,
      head: this.headInvoiceDtails,
      body: this.dataInvoiceDtails,
      theme: 'plain',
      margin: { left: 150 },
      headStyles: { fontSize: '12', textColor: '#01579b' },
      styles: {
        cellWidth: 95,
        fontSize: '10',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    doc.line(10, 42, 85, 42);
    doc.text('TAX INVOICE', 90, 44);
    doc.line(130, 42, 200, 42);

    (doc as any).autoTable({
      startY: 50,
      head: this.headSellerAddress,
      body: this.dataSellerAddress,
      theme: 'plain',
      margin: { left: 7, right: 7 },
      headStyles: { fontSize: '11', textColor: '#01579b' },
      styles: {
        fontSize: '10',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    this.generateItemData();

    (doc as any).autoTable({
      startY: 80,
      head: this.head,
      body: this.data,
      theme: 'striped',
      margin: { left: 8, right: 8 },
      headStyles: { fontSize: '10' },
      styles: { fontSize: '9' },
    });

    let finalY = (doc as any).lastAutoTable.finalY;

    (doc as any).autoTable({
      startY: finalY + 5,
      body: this.bodyTotal,
      theme: 'plain',
      styles: {
        cellWidth: 'wrap',
        fontStyle: 'bold',
        fontSize: '11',
        halign: 'right',
      },
    });

    finalY = (doc as any).lastAutoTable.finalY;
    doc.setFontSize(12);
    doc.line(145, finalY + 20, 195, finalY + 20);
    doc.text('Authorized Signature', 150, finalY + 30);

    // Footer
    doc.setFontSize(9);
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text('Powered by Atlas®', 10, 290);
      doc.text('Page ' + i + ' of ' + pageCount, 180, 290);
    }

    return doc;
  }

  public downloadPDF(): void {
    this.generatePDF().save('atlas.pdf');
  }

  openPreviewDialog() {
    if (!this.isValidInvoice()) {
      this.util.showSnackBar(
        'Missing fields required to generate invoice!',
        'Dismiss'
      );
      return;
    }

    const invoice = this.generatePDF();
    const pdf: ArrayBuffer = invoice.output('arraybuffer');
    this.dialog.open(InvoicePreviewComponent, {
      data: pdf,
      position: { top: '20px' },
    });
  }

  getClientOptionText(option: Client) {
    return option ? option.name : '';
  }

  getAddressOptionText(option: Address) {
    return option ? option.line1 : '';
  }

  expansionClosed() {
    this.open = false;
    let result = '';
    if (!this.open && this.client.address) {
      if (this.client.address.line1) {
        result += ' Address - ';
        result += this.client.address.line1;
      }
      if (this.client.address.line2) {
        result += ' , ';
        result += this.client.address.line2;
      }
      if (this.client.address.district) {
        result += ' , ';
        result += this.client.address.district;
      }
      if (this.client.address.pin) {
        result += ' - ';
        result += this.client.address.pin;
      }
    }
    this.combinedAddress = result;

    if (this.client.name) {
      this.clientPreview = this.client.name;
    } else {
      this.clientPreview = this.clientDefault;
    }
  }

  toggleExpansion() {
    this.open = !this.open;
  }

  sameAsBuyerCheck() {
    this.shippingAddress = this.client.address;
  }

  checkDueDate() {
    if (
      !this.dueDate ||
      this.dueDate.getFullYear() < this.invoiceDate.getFullYear() ||
      this.dueDate.getMonth() < this.invoiceDate.getMonth() ||
      this.dueDate.getDate() < this.invoiceDate.getDate()
    ) {
      this.dueDate = new Date(this.invoiceDate);
      this.util.showSnackBar("Due date can't be less than Invoice date.", '');
    }
  }

  getFormattedDate(date: Date): string {
    const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(
      date
    );
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(
      date
    );
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(
      date
    );
    return da + ' ' + mo + ' ' + ye;
  }

  generateItemData() {
    const dataArr = [];
    let counter = 1;

    this.items.forEach((item) => {
      const dataItem = [];

      dataItem.push(counter);
      dataItem.push(item.name + '\n(' + item.unit + ')');
      dataItem.push(item.id);
      dataItem.push(item.qty);
      dataItem.push(item.price);
      dataItem.push(item.price * item.qty);
      dataItem.push(item.discount);

      // Trimming off other value after total tax
      dataItem.push(item.taxValue + '\n(' + item.tax.substring(0, 2) + ')');
      dataItem.push(item.total);

      dataArr.push(dataItem);
      counter++;
    });

    // TODO add total row at the end

    this.data = dataArr;
  }
}
