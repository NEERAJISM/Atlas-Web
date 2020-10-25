import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';

import { jsPDF, jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';
import { InvoicePreviewComponent } from './preview/invoice.preview.component';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

interface Item {
  name: string;
  unit: string;
  qty: number;
  price: number;
  discount: number;
  tax: string;
  total: number;
}

interface Address {
  line1: string;
  line2: string;
  loc: string;
  pin: number;
}

interface Client {
  name: string;
  id: string;
  mobile: string;
  email: string;
}

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './editinvoice.component.html',
  styleUrls: ['./editinvoice.component.scss'],
})
export class EditInvoiceComponent implements OnInit {
  @ViewChild('htmlData') htmlData: ElementRef;

  pdf: ArrayBuffer;
  doc: jsPDF;

  selected = 'None';

  clientDefaultJson: Client = { name: '', id: '', mobile: '', email: '' };
  client: Client = this.clientDefaultJson;
  clientControl: FormControl = new FormControl();
  clientObservable: Observable<Client[]>;

  addressDefaultJson: Address = { line1: '', line2: '', loc: '', pin: undefined };
  address: Address = this.addressDefaultJson;
  address2: Address = this.addressDefaultJson;

  addressControl: FormControl = new FormControl();
  addressObservable: Observable<Address[]>;
  addressControl2: FormControl = new FormControl();
  addressObservable2: Observable<Address[]>;

  invoiceDate: Date = new Date();
  dueDate: Date = new Date();

  clientPreview = 'CustomerDetails';
  clientDefault = 'CustomerDetails';

  combinedAddress = '';
  customerAddress: Address[] = [
    {
      line1: 'c/o Balkrishna Patidar, Gamda',
      line2: 'Sagwara',
      loc: 'Dungarpur (Raj)',
      pin: 314025,
    },
    {
      line1: 'Police Lines',
      line2: 'New Colony',
      loc: 'Dungarpur (Raj)',
      pin: 314001,
    },
    {
      line1: 'Amal ka Kanta',
      line2: 'Surajpole',
      loc: 'Udaipur (Raj)',
      pin: 313001,
    },
  ];

  clients: Client[] = [
    {
      name: 'Indu Patidar',
      id: 'ASD51SDFK',
      mobile: '4521365488',
      email: 'abc@gmail.com',
    },
    {
      name: 'Neeraj Patidar',
      id: 'ASD51SDFK',
      mobile: '4521365488',
      email: 'abc@gmail.com',
    },
    {
      name: 'Damini Patidar',
      id: 'ASD51SDFK',
      mobile: '4521365488',
      email: 'abc@gmail.com',
    },
  ];

  controls: FormControl[] = [];
  observables: Observable<string[]>[] = [];

  optionsProduct: string[] = [
    'HCL',
    'Sulphuric',
    'Nitric',
    'Phosphic',
    'Aquarazia',
    'Citric',
    'Acidic',
  ];

  optionsUnit: string[] = ['250 ml', '500 ml', '1 L', '5 L'];
  optionsTax: string[] = [
    '0% (Tax-Exempt)',
    '5% (2.5% SGST + 2.5% CGST)',
    '12% (6% SGST + 6% CGST)',
    '18% (9% SGST + 9% CGST)',
    '28% (14% SGST + 14% CGST)',
  ];
  optionsTaxValue: number[] = [0, 0.05, 0.12, 0.18, 0.28];

  open = true;

  items: Item[] = [];

  title = 'jspdf-autotable-demo';

  headOwnerAddress = [['Krishna Borewell']];
  dataOwnerAddress = [
    ['C\\o Balkrishna Patidar, Gamda Brahmaniya'],
    ['Sagwara, Dungarpur (Raj) - 314025'],
    ['Email : 8patidarneeraj@gmail.com'],
    ['Mob : +91 - 8877073059'],
  ];

  headInvoiceDtails = [['Invoice # 1254-5621']];
  dataInvoiceDtails = [
    ['Issue Date     : 20 Sep 2020'],
    ['Due   Date     : 20 Sep 2020'],
    ['Supply Place : Sagwara'],
    ['Supply State : Rajasthan'],
  ];

  headSellerAddress = [
    ['Customer Name', 'Billing Address', 'Shipping Address'],
  ];

  dataSellerAddress = [
    [
      'Neeraj Patidar',
      'Co Balkrishna Patidar, Gamda Brahmaniya',
      '27,Lakshmi Marg, Amal ka kanta,',
    ],
    [
      'PAN : JHSVJHSV521',
      'Sagwara, Dungarpur (Raj) - 314025',
      'Udaipur (Raj) - 313001',
    ],
    // ['Email : 8patidarneeraj@gmail.com', 'Email : 8patidarneeraj@gmail.com', 'Email : rajatjainakhawat@gmail.com'],
    [
      'Email : 8patidarneeraj@gmail.com',
      'Mob : +91 - 8877073059',
      'Mob : +91 - 9929307208',
    ],
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
      'Item Description',
      'Code',
      'Qty',
      'Price',
      'Total',
      'SGST',
      'CGST',
      'Total + Tax',
    ],
  ];

  data = [
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      1,
      'Sulphuric Acid 500 ml bottle',
      532,
      5,
      500.0,
      2500.0,
      '225.0\n(9%)',
      '225.0\n(9%)',
      2950.0,
    ],
    [
      ,
      'SHIPPING + PACKAGING CHARGES',
      ,
      ,
      50.0,
      ,
      '4.5\n(9%)',
      '4.5\n(9%)',
      59.0,
    ],
    [, 'TOTAL', , , 15000.0, , '4050\n(9%)', '4050\n(9%)', 21500.0],
  ];

  constructor(
    private router: Router,
    private snackBar: MatSnackBar,
    public dialog: MatDialog
  ) {
    this.addItem();
  }

  ngOnInit(): void {
    this.clientObservable = this.clientControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this.clients.filter((option) =>
          option.name.toLowerCase().includes(value)
        )
      )
    );

    this.addressObservable = this.addressControl.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this.customerAddress.filter((option) =>
          option.line1.toLowerCase().includes(value)
        )
      )
    );

    this.addressObservable2 = this.addressControl2.valueChanges.pipe(
      startWith(''),
      map((value) =>
        this.customerAddress.filter((option) =>
          option.line1.toLowerCase().includes(value)
        )
      )
    );
  }

  goBackToInvoiceComponent() {
    this.router.navigateByUrl('/dashboard/invoice');
  }

  addItem() {
    if (this.open && this.items.length >= 1) {
      this.expansionClosed();
    }

    if (this.validateItems()) {
      this.openSnackBar('New item added!', 'Dismiss');
      const item = {} as Item;
      item.qty = 1;
      item.discount = 0;
      item.tax = this.optionsTax[0];
      this.items.push(item);
      this.addFormControl();
    } else {
      this.openSnackBar('Please enter valid values', 'Dismiss');
    }
  }

  removeItem(index: number) {
    this.items.splice(index, 1);
    this.controls.splice(index, 1);
    this.observables.splice(index, 1);
  }

  addFormControl() {
    const myControl = new FormControl();
    const filteredOptions: Observable<string[]> = myControl.valueChanges.pipe(
      startWith(''),
      map((value) => this._filter(this.optionsProduct, value))
    );

    this.controls.push(myControl);
    this.observables.push(filteredOptions);
  }

  private _filter(list: any[], value: string): string[] {
    return list.filter((option) =>
      option.toLowerCase().includes(value.toLowerCase())
    );
  }

  calculate(item: Item): number {
    item.total = Math.abs(item.qty) * Math.abs(item.price);

    if (item.total <= 0) {
      return item.total;
    }

    item.total -= Math.abs(item.discount);
    const index = this.optionsTax.indexOf(item.tax);

    if (index !== -1) {
      item.total =
        Math.round(
          (item.total * (1 + this.optionsTaxValue[index]) + Number.EPSILON) *
            100
        ) / 100;
    }
    return item.total;
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
      this.client &&
      this.client.name &&
      this.client.name.length > 0 &&
      this.client.mobile &&
      this.address.line1 &&
      this.address.line1.length > 0 &&
      this.address.loc &&
      this.address.loc.length > 0 &&
      this.address.pin
    ) {
      return this.validateItems();
    }
    this.markAllTouched();
    return false;
  }

  markAllTouched(){
    this.clientControl.markAsTouched();
    this.addressControl.markAsTouched();
  }

  public generatePDF(): void {
    const options: jsPDFOptions = {};
    options.compress = true;

    this.doc = new jsPDF(options);

    this.doc.addImage(
      '../../assets/icons/atlas-small.png',
      'PNG',
      7,
      12,
      17,
      17
    );

    (this.doc as any).autoTable({
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

    (this.doc as any).autoTable({
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

    this.doc.line(10, 42, 85, 42);
    this.doc.text('TAX INVOICE', 90, 44);
    this.doc.line(130, 42, 200, 42);

    (this.doc as any).autoTable({
      startY: 50,
      head: this.headSellerAddress,
      body: this.dataSellerAddress,
      theme: 'plain',
      margin: { left: 7, right: 7 },
      headStyles: { fontSize: '11', textColor: '#01579b' },
      styles: {
        // cellWidth: 95,
        fontSize: '10',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    (this.doc as any).autoTable({
      startY: 80,
      head: this.head,
      body: this.data,
      theme: 'striped',
      margin: { left: 8, right: 8 },
      headStyles: { fontSize: '10' },
      styles: { fontSize: '9' },
    });

    let finalY = (this.doc as any).lastAutoTable.finalY;

    (this.doc as any).autoTable({
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

    finalY = (this.doc as any).lastAutoTable.finalY;
    this.doc.setFontSize(12);
    this.doc.line(145, finalY + 20, 195, finalY + 20);
    this.doc.text('Authorized Signature', 150, finalY + 30);

    // Footer

    this.doc.setFontSize(9);
    const pageCount = (this.doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i);
      this.doc.text('Powered by Atlas®', 10, 290);
      this.doc.text('Page ' + i + ' of ' + pageCount, 180, 290);
    }
  }

  public downloadPDF(): void {
    this.generatePDF();
    this.doc.save('atlas.pdf');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }

  openPreviewDialog() {
    if (!this.isValidInvoice()) {
      this.openSnackBar(
        'Missing fields required to generate invoice!',
        'Dismiss'
      );
      return;
    }

    this.generatePDF();
    this.pdf = this.doc.output('arraybuffer');
    this.dialog.open(InvoicePreviewComponent, {
      data: this.pdf,
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
    if (!this.open && this.address) {
      if (this.address.line1) {
        result += ' Address - ';
        result += this.address.line1;
      }
      if (this.address.line2) {
        result += ' , ';
        result += this.address.line2;
      }
      if (this.address.loc) {
        result += ' , ';
        result += this.address.loc;
      }
      if (this.address.pin) {
        result += ' - ';
        result += this.address.pin;
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
    this.address2 = this.address;
  }

  checkDueDate() {
    if (
      !this.dueDate ||
      this.dueDate.getFullYear() < this.invoiceDate.getFullYear() ||
      this.dueDate.getMonth() < this.invoiceDate.getMonth() ||
      this.dueDate.getDate() < this.invoiceDate.getDate()
    ) {
      this.dueDate = new Date(this.invoiceDate);
      this.openSnackBar('Invalid Due Date', '');
    }
  }

  clientChange(event){
    if (typeof event === 'string') {
      this.client = Object.assign({}, this.clientDefaultJson);
      this.client.name = event;
    }
  }

  addressChange(event){
    if (typeof event === 'string') {
      this.address = Object.assign({}, this.addressDefaultJson);
      this.address.line1 = event;
    }
  }
}
