import { Component, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {
    this.loadClients();
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
    const item = {} as Item;
    item.price = this.items.length + 1;
    this.items.push(item);
  }

  public openPDF(): void {
    // let DATA = this.htmlData.nativeElement;
    // let doc = new jsPDF ();
    // doc.fromHTML(DATA.innerHTML, 15, 15);
    // doc.output('dataurlnewwindow');
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

    // fOOTER
    // doc.setFontSize(11);
    // doc.text('Page 1 of 1', 185, 7);

    doc.setFontSize(9);
    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.text( "Powered by Atlas®", 10, 290);
      doc.text( "Page " + i + " of " + pageCount, 180, 290);
    }

    doc.save('atlas.pdf');
  }
}