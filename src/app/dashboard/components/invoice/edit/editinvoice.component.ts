import { Component, ElementRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { CommonUtil } from '@core/common.util';
import { Constants } from '@core/constants';
import { FirebaseUtil } from '@core/firebaseutil';
import { Address } from '@core/models/address';
import { Business } from '@core/models/business';
import { Client } from '@core/models/client';
import { Invoice, InvoiceVersion, Item } from '@core/models/invoice';
import { InvoicePreview } from '@core/models/invoice.preview';
import { Product, Unit } from '@core/models/product';
import { jsPDF, jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { InvoiceService } from '../invoice.service';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './editinvoice.component.html',
  styleUrls: ['./editinvoice.component.scss'],
})
export class EditInvoiceComponent {
  invoice: Invoice = new Invoice();
  existingInvoice = false;

  isInvoiceDetailValid = false;
  isCustomerDetailValid = false;
  isBillingAddressValid = false;
  isShippingAddressValid = false;
  isItemSummaryValid = false;

  // Invoice Dates
  invoiceDate: Date = new Date();
  dueDate: Date = new Date();
  customDueDate = false;

  business: Business;
  supplyPlace = '';
  supplyState = '';
  states = Constants.states;

  // Also update "getDueDte" function in this class
  allPaymentTerms: string[] = [
    'Custom Select',
    'Paid',
    'Due in 7 days',
    'Due in 15 days',
    'Due in 30 days',
    'Due in 45 days',
    'Due in 60 days'
  ];

  paymentTerms = this.allPaymentTerms[1];

  // Client Details
  clients: Client[] = [];
  clientsMap: Map<string, Client> = new Map();
  clientControl: FormControl = new FormControl();
  clientObservable: Observable<Client[]>;

  client: Client = new Client();
  shippingAddress: Address = new Address();
  shippingAddressSame = true;

  // Item Summary
  controls: FormControl[] = [];
  observables: Observable<Product[]>[] = [];
  unitControls: FormControl[] = [];
  unitObservables: Observable<Unit[]>[] = [];

  productUnitMap: Map<string, Unit[]> = new Map();
  optionsProduct: Product[] = [];

  optionsTax: string[] = [
    '0% GST',
    '5% GST',
    '12% GST',
    '18% GST',
    '28% GST',
  ];
  optionsTaxValue: number[] = [0, 0.05, 0.12, 0.18, 0.28];

  items: Item[] = [];
  data = [];

  //////////////////////////// PDF /////////////////////////////////////

  title = 'jspdf-autotable-demo';
  headOwnerAddress = [['']];
  dataOwnerAddress = [[''], [''], [''], ['']];

  headInvoiceDetails = [['Invoice # 1254-5621']];

  dataInvoiceDetails = [
    'Issue Date     : ',
    'Due   Date     : ',
    'Supply Place : ',
    'Supply State  : '
  ];

  invoiceBuyerDefault: string[] = ['Customer Name', 'Billing Address', 'Shipping Address'];

  invoiceItemHead = [
    [
      'No.',
      'Item Description (Unit)',
      'Code',
      'Qty',
      'Price',
      'Amount',
      'Discount',
      'Tax / GST',
      'Total (Inc. Tax)',
    ],
  ];

  totalAmount = 0;
  totalTax = 0;
  total = 0;
  bodyTotal = [
    ['Total Amount', ''],
    ['', ''],
    ['Final Amount (Total + Tax)', '']
  ];

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private fbutil: FirebaseUtil,
    private util: CommonUtil,
    private elRef: ElementRef,
    private invoiceService: InvoiceService
  ) {
    this.getBusinessInfo();
    this.fetchClients();
    this.fetchProducts();
    this.fetchInvoice();
  }

  fetchInvoice() {
    if (!this.invoiceService.invoiceId) {
      this.addItem();
      return;
    }

    this.existingInvoice = true;
    this.fbutil.getInvoiceRef('bizId')
      .doc(this.invoiceService.invoiceId).get().forEach((invoice) => {
        if (invoice.exists) {
          Object.assign(this.invoice, invoice.data());
          if (this.invoice.allVersions && this.invoice.allVersions.length > 0) {
            this.updateFieldsForExistingInvoice(this.invoice.allVersions[this.invoice.allVersions.length - 1]);
          }
        }
      }).catch(e => {
        this.addItem();
        this.util.showSnackBar('Error while loading invoice data!', 'Close');
        console.log(e);
      });
  }

  updateFieldsForExistingInvoice(i: InvoiceVersion) {
    this.dueDate = new Date(i.dueDate);
    this.invoiceDate = new Date(i.invoiceDate);
    this.supplyState = i.supplyState;
    this.supplyPlace = i.supplyPlace;
    this.paymentTerms = i.paymentTerms;
    this.customDueDate = (i.paymentTerms === this.allPaymentTerms[0]);

    this.client.copy(i.client);
    this.shippingAddress = i.shippingAddress;
    this.shippingAddressSame = i.shippingAddressSame;
    this.isShippingAddressValid = true;

    if (i.items) {
      for (const j of i.items) {
        this.addFormControl();
      }
      this.items = i.items;
    }

    this.total = i.total;
    this.totalTax = i.totalTax;
    this.totalAmount = i.totalTaxableValue;
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

  clientNameChange(event: string) {
    if (event && this.clientsMap.has(event.toLowerCase())) {
      this.client.copy(this.clientsMap.get(event.toLowerCase()));
    } else {
      this.client = new Client();
      this.client.name = event;
    }
    this.customerDetailChange();
  }

  updateClients(c: Client[]) {
    this.clients = c;
    c.forEach(client => this.clientsMap.set(client.name.toLowerCase(), client));

    this.clientControl.valueChanges.subscribe((value) => {
      if (typeof value === 'string') {
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
  }

  goBackToInvoiceComponent() {
    this.router.navigateByUrl('/dashboard/invoice');
  }

  addItem() {
    if (this.validateItems()) {
      const item = new Item();
      item.qty = 1;
      item.discount = 0;
      item.tax = this.optionsTax[0];
      this.items.push(item);
      this.addFormControl();
      this.isItemSummaryValid = false;
      setTimeout(() => { this.elRef.nativeElement.parentElement.scrollTop = this.elRef.nativeElement.parentElement.scrollHeight; }, 100);
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
    this.itemChange();
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
        map((v) => this._filterUnit(units, v))
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
    this.itemChange();
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
        item.qty
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
      this.client.address.pin &&
      this.items.length > 0
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

    this.headOwnerAddress[0][0] = this.business.name;

    this.dataOwnerAddress[0][0] = this.business.addresses[0].line1 + ', ' + this.business.addresses[0].line2;
    this.dataOwnerAddress[1][0] = this.business.addresses[0].district + ' (' + this.business.addresses[0].state + ') - ' +
      this.business.addresses[0].pin;
    this.dataOwnerAddress[2][0] = 'Email : ' + this.business.email;
    this.dataOwnerAddress[3][0] = 'Tel : ' + this.business.phone + ', Mob : ' + this.business.mobile;

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

    const dataInvoiceDetails = [];
    dataInvoiceDetails[0] = [];
    dataInvoiceDetails[1] = [];
    dataInvoiceDetails[2] = [];
    dataInvoiceDetails[3] = [];
    dataInvoiceDetails[0][0] = this.dataInvoiceDetails[0] + this.getFormattedDate(this.invoiceDate);
    dataInvoiceDetails[1][0] = this.dataInvoiceDetails[1] + this.getFormattedDate(this.dueDate);
    dataInvoiceDetails[2][0] = this.dataInvoiceDetails[2] + this.supplyPlace;
    dataInvoiceDetails[3][0] = this.dataInvoiceDetails[3] + this.supplyState;

    const headSellerAddress = [];
    headSellerAddress[0] = this.invoiceBuyerDefault;

    const dataSellerAddress = this.getAddressArray();

    dataSellerAddress[0][0] = this.client.name;
    dataSellerAddress[1][0] = 'PAN : ' + (this.client.gst ? this.client.gst : '');
    dataSellerAddress[2][0] = 'Email : ' + (this.client.email ? this.client.email : '');
    dataSellerAddress[3][0] = 'Mobile : ' + (this.client.mobile ? '+91 - ' + this.client.mobile : '');

    dataSellerAddress[0][1] = this.client.address.line1 ? this.client.address.line1 : '';
    dataSellerAddress[1][1] = this.client.address.line2 ? this.client.address.line2 : '';
    dataSellerAddress[2][1] = this.client.address.district + ' - ' + this.client.address.pin;
    dataSellerAddress[3][1] = this.client.address.state;

    if (this.shippingAddressSame) {
      this.shippingAddress.copy(this.client.address);
    }
    dataSellerAddress[0][2] = this.shippingAddress.line1 ? this.shippingAddress.line1 : '';
    dataSellerAddress[1][2] = this.shippingAddress.line2 ? this.shippingAddress.line2 : '';
    dataSellerAddress[2][2] = this.shippingAddress.district + ' - ' + this.shippingAddress.pin;
    dataSellerAddress[3][2] = this.shippingAddress.state;

    (doc as any).autoTable({
      startY: 9,
      head: this.headInvoiceDetails,
      body: dataInvoiceDetails,
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
      head: headSellerAddress,
      body: dataSellerAddress,
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
      head: this.invoiceItemHead,
      body: this.data,
      theme: 'striped',
      margin: { left: 8, right: 8 },
      headStyles: { fontSize: '10' },
      styles: { fontSize: '9' },
    });

    let finalY = (doc as any).lastAutoTable.finalY;

    this.bodyTotal[0][1] = String(this.totalAmount);

    if (this.supplyState === this.shippingAddress.state) {
      this.bodyTotal[1][0] = Constants.TAX_STRING_SGST;
    } else {
      this.bodyTotal[1][0] = Constants.TAX_STRING_IGST;
    }
    this.bodyTotal[1][1] = String(this.totalTax);

    const tot = Math.floor(this.total);
    const dec = Math.floor((this.total - tot) * 100);
    this.bodyTotal[2][1] = this.total + '\n' + this.inWords(tot) + 'Rupees ' + (dec > 0 ? this.inWords(dec) + 'Paise ' : '');

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

  // public downloadPDF(): void {
  //   this.generatePDF().save('atlas.pdf');
  // }

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
    const dialogRef = this.dialog.open(InvoicePreviewComponent, {
      data: pdf,
      position: { top: '20px' },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result.event === 'Save') {
        this.createAndSaveInvoice(false);
      }
    });
  }

  saveAsDraft() {
    this.createAndSaveInvoice(true);
  }

  createAndSaveInvoice(saveAsDraft: boolean) {
    const timestamp = Date.now();

    let version: InvoiceVersion;
    if (this.existingInvoice && this.invoice.allVersions.length > 0) {
      version = this.invoice.allVersions[this.invoice.allVersions.length - 1];

      if (!version.isDraft) {
        version = new InvoiceVersion();
        version.createdTimeUtc = timestamp;
        this.invoice.allVersions.push(version);
      }
    } else {
      // TODO generate invoice no using counter
      this.invoice.invoiceNo = '12345';
      this.invoice.id = this.fbutil.getId();

      version = new InvoiceVersion();
      version.createdTimeUtc = timestamp;
      this.invoice.allVersions.push(version);
    }

    version.isDraft = saveAsDraft;
    version.lastUpdatedTimeUtc = timestamp;

    version.invoiceDate = this.invoiceDate.toDateString();
    version.dueDate = this.dueDate.toDateString();
    version.supplyState = this.supplyState;
    version.supplyPlace = this.supplyPlace;
    version.paymentTerms = this.paymentTerms;

    version.client = this.client;
    version.shippingAddress = this.shippingAddress;
    version.shippingAddressSame = this.shippingAddressSame;
    version.items = this.items;

    version.totalTaxableValue = this.totalAmount;
    version.totalTax = this.totalTax;
    version.total = this.total;

    const preview: InvoicePreview = new InvoicePreview();
    preview.id = this.invoice.id;
    preview.invoiceNo = this.invoice.invoiceNo;
    preview.isDraft = saveAsDraft;
    preview.client = version.client.name;
    preview.address = version.client.address.district + ', ' + version.client.address.state + ' - ' + version.client.address.pin;
    preview.amount = version.total;
    preview.invoiceDate = version.invoiceDate;
    preview.dueDate = version.dueDate;
    preview.lastUpdatedTimeUtc = timestamp;

    this.fbutil.getInvoicePreviewRef('bizId')
      .doc(this.invoice.id)
      .set(this.fbutil.toJson(preview));

    this.fbutil
      .getInvoiceRef('bizId')
      .doc(this.invoice.id)
      .set(this.fbutil.toJson(this.invoice))
      .then(() => this.goBackToInvoiceComponent())
      .catch((e) => {
        console.log(e);
        this.util.showSnackBar('Error while saving data', 'Close');
      });
  }

  getClientOptionText(option: Client) {
    return option ? option.name : '';
  }

  getAddressOptionText(option: Address) {
    return option ? option.line1 : '';
  }

  checkDueDate() {
    if (
      !this.dueDate ||
      this.dueDate.getFullYear() < this.invoiceDate.getFullYear() ||
      this.dueDate.getMonth() < this.invoiceDate.getMonth() ||
      this.dueDate.getDate() < this.invoiceDate.getDate()
    ) {
      this.dueDate = this.getDueDate();
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
    this.totalAmount = 0;
    this.totalTax = 0;
    this.total = 0;

    this.items.forEach((item) => {
      const dataItem = [];

      dataItem.push(counter);
      dataItem.push(item.name + '\n(' + item.unit + ')');
      dataItem.push(item.id);
      dataItem.push(item.qty);
      dataItem.push(item.price);

      const a = item.price * item.qty;
      dataItem.push(a);
      dataItem.push(item.discount);
      this.totalAmount += (a - item.discount);

      // Trimming off other value after total tax
      dataItem.push(item.taxValue + '\n(' + item.tax.substring(0, 3).trim() + ')');
      this.totalTax += item.taxValue;

      dataItem.push(item.total);
      this.total += item.total;

      dataArr.push(dataItem);
      counter++;
    });

    this.data = dataArr;
  }

  isValidAddress(address: Address): boolean {
    return (
      address.line1 && address.line1.length > 0 &&
      address.line2 && address.line2.length > 0 &&
      address.district && address.district.length > 0 &&
      address.state && address.state.length > 0 &&
      address.pin
    ) ? true : false;
  }

  getAddressArray(): string[][] {
    const a = [];
    for (let i = 0; i < 4; i++) {
      a[i] = [];
    }
    return a;
  }

  inWords(num: string | number) {
    if ((num = num.toString()).length > 9) { return ''; }
    const n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
    const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    if (!n) { return; } let str = '';
    str += (Number(n[1]) !== 0) ? (a[n[1]] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'Crore ' : '';
    str += (Number(n[1]) !== 0) ? (a[n[2]] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'Lakh ' : '';
    str += (Number(n[3]) !== 0) ? (a[n[3]] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'Thousand ' : '';
    str += (Number(n[4]) !== 0) ? (a[n[4]] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'Hundred ' : '';
    str += (Number(n[5]) !== 0) ? ((str !== '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) : '';
    return str;
  }

  getBusinessInfo() {
    const b = new Business();
    b.name = 'Krishna Enterprises';
    b.email = '8patidarneeraj@gmail.com';
    b.mobile = '+91 - 8877073059';
    b.phone = '02964 - 230354';

    const a = new Address();
    a.line1 = 'C\\o Balkrishna Patidar';
    a.line2 = 'Gamda Brahmaniya, Sagwara';
    a.district = 'Dungarpur';
    a.state = 'Rajasthan';
    a.pin = 314025;
    b.addresses[0] = a;

    this.business = b;
    this.supplyPlace = b.addresses[0].district;
    this.supplyState = b.addresses[0].state;

    this.isInvoiceDetailValid = (this.supplyPlace && this.supplyState) ? true : false;
  }

  supplyPlaceChange() {
    if (this.supplyPlace) {
      this.isInvoiceDetailValid = true;
    } else {
      this.isInvoiceDetailValid = false;
    }
  }

  customerDetailChange() {
    if (this.client.name && this.client.mobile) {
      this.isCustomerDetailValid = true;
    } else {
      this.isCustomerDetailValid = false;
    }
    this.billingAddressChange();
  }

  billingAddressChange() {
    if (this.client.address.line1 && this.client.address.pin && this.client.address.district && this.client.address.state) {
      this.isBillingAddressValid = true;
    } else {
      this.isBillingAddressValid = false;
    }
  }

  shippingAddressChange() {
    if (this.shippingAddress.line1 && this.shippingAddress.pin && this.shippingAddress.district && this.shippingAddress.state) {
      this.isItemSummaryValid = true;
    } else {
      this.isItemSummaryValid = false;
    }
  }

  itemChange() {
    for (const item of this.items) {
      if (
        item.name &&
        item.unit &&
        item.price != null && item.price >= 0 &&
        item.qty
      ) {
        continue;
      } else {
        this.isItemSummaryValid = false;
        return;
      }
    }
    this.isItemSummaryValid = (this.items.length === 0) ? false : true;
  }

  paymentStatusChange() {
    this.customDueDate = (this.paymentTerms === this.allPaymentTerms[0]);
    this.dueDate = this.getDueDate();
  }

  getDueDate() {
    let days = 0;
    switch (this.paymentTerms) {
      case this.allPaymentTerms[2]:
        days = 7;
        break;
      case this.allPaymentTerms[3]:
        days = 15;
        break;
      case this.allPaymentTerms[4]:
        days = 30;
        break;
      case this.allPaymentTerms[5]:
        days = 45;
        break;
      case this.allPaymentTerms[6]:
        days = 60;
        break;
    }

    const result = new Date(this.invoiceDate);
    result.setDate(result.getDate() + days);
    return result;
  }
}
