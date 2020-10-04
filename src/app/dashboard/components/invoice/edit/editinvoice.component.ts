import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

import { jsPDF, jsPDFOptions } from 'jspdf';
import 'jspdf-autotable';

interface Item {
  name: string;
  unit: string;
  qty: number;
  price: number;
  discount: number;
  tax: number;
  total: number;
}

@Component({
  selector: 'app-edit-invoice',
  templateUrl: './editinvoice.component.html',
  styleUrls: ['./editinvoice.component.scss'],
})
export class EditInvoiceComponent {
  @ViewChild('htmlData') htmlData: ElementRef;

  selected: string = 'None';

  myControl = new FormControl();
  optionsProduct: string[] = ['HCL', 'Sulphuric', 'Nitric', 'Phosphic'];
  optionsUnit: string[] = ['250 ml', '500 ml', '1 L', '5 L'];
  optionsTax: string[] = [
    '5% (2.5% SGST + 2.5% CGST)',
    '12% (6% SGST + 6% CGST)',
    '18% (9% SGST + 9% CGST)',
    '28% (14% SGST + 14% CGST)',
  ];

  step = 0;

  items: Item[] = [];

  title = 'jspdf-autotable-demo';

  headOwnerAddress = [['Invoice # 1254-5621', 'Seller : Krishna Borewell']];

  dataOwnerAddress = [
    [
      'Issue Date     : 20 Sep 2020',
      'C\\o Balkrishna Patidar, Gamda Brahmaniya',
    ],
    ['Due   Date     : 20 Sep 2020', 'Sagwara, Dungarpur (Raj) - 314025'],
    ['Supply Place : Sagwara', 'Email : 8patidarneeraj@gmail.com'],
    ['', 'Mob : +91 - 8877073059'],
  ];

  headSellerAddress = [
    ['Billing To : \nNeeraj Patidar', 'Shipping To : \nRajat Jain Akhawat'],
  ];

  dataSellerAddress = [
    [
      'Co Balkrishna Patidar, Gamda Brahmaniya',
      '27,Lakshmi Marg, Amal ka kanta,',
    ],
    ['Sagwara, Dungarpur (Raj) - 314025', 'Udaipur (Raj) - 313001'],
    ['Email : 8patidarneeraj@gmail.com', 'Email : rajatjainakhawat@gmail.com'],
    ['Mob : +91 - 8877073059', 'Mob : +91 - 9929307208'],
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
  ];

  constructor(private router: Router, private snackBar: MatSnackBar) {
    this.loadClients();
    this.addItem();
  }

  loadClients() {}

  goBackToInvoiceComponent() {
    this.router.navigateByUrl('/dashboard/invoice');
  }

  setStep(index: number) {
    this.step = index;
  }

  nextStep() {
    this.step++;
  }

  prevStep() {
    this.step--;
  }

  addItem() {
    if (this.validateItems()) {
      this.openSnackBar('New item added!', 'Dismiss');
      const item = {} as Item;
      item.qty = 1;
      item.discount = 0;
      this.items.push(item);
    } else {
      this.openSnackBar('Please enter valid values', 'Dismiss');
    }
  }

  calculate(item: Item): number {
    item.total =
      Math.abs(item.qty) * Math.abs(item.price) - Math.abs(item.discount);
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

  removeItem(index: number) {
    this.items.splice(index, 1);
  }

  public downloadPDF(): void {
    const options: jsPDFOptions = {};
    options.compress = true;

    const doc = new jsPDF(options);

    doc.addImage('../../assets/icons/atlas-small.png', 'PNG', 185, 7, 17, 17);

    doc.setFontSize(30);
    doc.text('TAX INVOICE', 13, 20);

    (doc as any).autoTable({
      startY: 30,
      head: this.headOwnerAddress,
      body: this.dataOwnerAddress,
      theme: 'plain',
      headStyles: { fontSize: '13', textColor: '#01579b' },
      styles: {
        cellWidth: 95,
        fontSize: '11',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    (doc as any).autoTable({
      startY: 65,
      head: this.headSellerAddress,
      body: this.dataSellerAddress,
      theme: 'plain',
      headStyles: { fontSize: '13', textColor: '#01579b' },
      styles: {
        cellWidth: 95,
        fontSize: '11',
        cellPadding: { top: 1, right: 1, bottom: 0, left: 1 },
      },
    });

    (doc as any).autoTable({
      startY: 110,
      head: this.head,
      body: this.data,
      theme: 'striped',
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

    doc.save('atlas.pdf');
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
}
