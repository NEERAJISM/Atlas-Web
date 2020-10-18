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
  name: string;
  line1: string;
  line2: string;
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


  addressControl: FormControl =new FormControl();
  addressObservable: Observable<Address[]>;
  addressControl2: FormControl =new FormControl();
  addressObservable2: Observable<Address[]>;

  combinedAddress = '';
  address: Address = {name: '', line1: '', line2: ''};
  address2: Address = {name: '', line1: '', line2: ''};
  customerAddress: Address[] = [
    {name: 'customer1', line1:'addressline1', line2:'line21'},
    {name: 'customer2', line1:'addressline2', line2:'line22'},
    {name: 'customer3', line1:'addressline3', line2:'line23'},
  ]

  controls: FormControl[] = [];
  observables: Observable<string[]>[] = [];

  optionsProduct: string[] = ['HCL', 'Sulphuric', 'Nitric', 'Phosphic', 'Aquarazia', 'Citric', 'Acidic'];

  optionsUnit: string[] = ['250 ml', '500 ml', '1 L', '5 L'];
  optionsTax: string[] = [
    '5% (2.5% SGST + 2.5% CGST)',
    '12% (6% SGST + 6% CGST)',
    '18% (9% SGST + 9% CGST)',
    '28% (14% SGST + 14% CGST)',
  ];
  optionsTaxValue: number[] = [0.05, 0.12, 0.18, 0.28];

  open = true;

  items: Item[] = [];

  title = 'jspdf-autotable-demo';

  headOwnerAddress = [['Krishna Borewell']];
  dataOwnerAddress = [
    [ 'C\\o Balkrishna Patidar, Gamda Brahmaniya'],
    [ 'Sagwara, Dungarpur (Raj) - 314025'],
    [ 'Email : 8patidarneeraj@gmail.com'],
    [ 'Mob : +91 - 8877073059'],
  ];

  headInvoiceDtails = [['Invoice # 1254-5621']];
  dataInvoiceDtails = [
    ['Issue Date     : 20 Sep 2020' ],
    ['Due   Date     : 20 Sep 2020'],
    ['Supply Place : Sagwara'],
    ['Supply State : Rajasthan']
  ];

  headSellerAddress = [
    ['Customer Name', 'Billing Address', 'Shipping Address'],
  ];

  dataSellerAddress = [
    ['Neeraj Patidar' , 'Co Balkrishna Patidar, Gamda Brahmaniya' , '27,Lakshmi Marg, Amal ka kanta,'],
    ['PAN : JHSVJHSV521' , 'Sagwara, Dungarpur (Raj) - 314025', 'Udaipur (Raj) - 313001'],
    // ['Email : 8patidarneeraj@gmail.com', 'Email : 8patidarneeraj@gmail.com', 'Email : rajatjainakhawat@gmail.com'],
    ['Email : 8patidarneeraj@gmail.com', 'Mob : +91 - 8877073059', 'Mob : +91 - 9929307208'],
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
    [
      ,
      'TOTAL',
      ,
      ,
      15000.0,
      ,
      '4050\n(9%)',
      '4050\n(9%)',
      21500.0,
    ],
  ];

  constructor(private router: Router, private snackBar: MatSnackBar, public dialog: MatDialog) {
    this.loadClients();
    this.addItem();
  }
  ngOnInit(): void {
    this.addressObservable = this.addressControl.valueChanges
    .pipe(
      startWith(''),
      map(value => this.customerAddress.filter(option => option.name.toLowerCase().includes(value)))
    );

    this.addressObservable2 = this.addressControl2.valueChanges
    .pipe(
      startWith(''),
      map(value => this.customerAddress.filter(option => option.name.toLowerCase().includes(value)))
    );
  }

  loadClients() {}

  goBackToInvoiceComponent() {
    this.router.navigateByUrl('/dashboard/invoice');
  }

  addItem() {
    if (this.validateItems()) {
      this.openSnackBar('New item added!', 'Dismiss');
      const item = {} as Item;
      item.qty = 1;
      item.discount = 0;
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
    let myControl = new FormControl();
    let filteredOptions: Observable<string[]> = myControl.valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter(this.optionsProduct, value))
      );

    this.controls.push(myControl);
    this.observables.push(filteredOptions);
  }

  private _filter(list: any[], value: string): string[] {
    return list.filter(option => option.toLowerCase().includes(value.toLowerCase()));
  }

  calculate(item: Item): number {
    item.total = Math.abs(item.qty) * Math.abs(item.price);

    if (item.total <= 0) {
      return item.total;
    }

    item.total -=  Math.abs(item.discount);
    const index = this.optionsTax.indexOf(item.tax);

    if (index !== -1) {
      item.total = Math.round(((item.total * (1 + this.optionsTaxValue[index])) + Number.EPSILON) * 100) / 100;
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

  public generatePDF(): void {
    const options: jsPDFOptions = {};
    options.compress = true;

    this.doc = new jsPDF(options);

    this.doc.addImage('../../assets/icons/atlas-small.png', 'PNG', 7, 12, 17, 17);

    (this.doc as any).autoTable({
      startY: 9,
      head: this.headOwnerAddress,
      body: this.dataOwnerAddress,
      theme: 'plain',
      margin: {left: 27},
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
      margin: {left: 150},
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
      margin: {left: 7, right: 7},
      headStyles: { fontSize: '11', textColor: '#01579b'},
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
      margin: {left: 8, right: 8},
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

  openPreviewDialog(){
    this.generatePDF();
    this.pdf = this.doc.output('arraybuffer');
    this.dialog.open(InvoicePreviewComponent, {
    data: this.pdf,
    position: {top: '20px'}
    });
  }

  getOptionText(option) {
    return option ? option.name : '';
  }

  expansionClosed(){
    this.open = false;
    let result = '';
    if (!this.open && this.address) {
      if (this.address.name) {
        result += this.address.name + ' , ';
      }
      if (this.address.line1) {
        result += this.address.line1 + ' , ';
      }
      if (this.address.line2) {
        result += this.address.line2;
      }
    }
    this.combinedAddress = result;
  }

  toggleExpansion() {
    this.open = !this.open;
  }

  sameAsBuyerCheck() {
    this.address2 = this.address;
  }
}
