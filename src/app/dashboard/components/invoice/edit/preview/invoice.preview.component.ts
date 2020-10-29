import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'invoice-preview-dialog',
  templateUrl: 'invoice.preview.component.html',
})
export class InvoicePreviewComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data) {}
}
