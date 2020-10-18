import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'invoice-preview-dialog',
  templateUrl: 'invoice.preview.component.html',
})
export class InvoicePreviewComponent {
  pdfSrc = 'https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf';

  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}
