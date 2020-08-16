import { Component, HostListener } from '@angular/core';
import { Router } from '@angular/router';


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
  step = 0;

  items: Item[] = [];

  constructor(private router: Router) {
  }

  goBackToInvoiceComponent(){
    this.router.navigateByUrl('/dashboard/invoice');
  }

  @HostListener('window:scroll', ['$event'])
  onWindowScroll(e) {
    const element = document.querySelector('.dashboard-header');
    const navbarElement = document.querySelector('.invoice-navbar');

    if ( element && window.pageYOffset < element.clientHeight) {
      navbarElement.classList.remove('sticky');
    } else {
      navbarElement.classList.add('sticky');
    }
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

  addItem(){
    const item = {} as Item;
    item.price = this.items.length + 1;
    this.items.push(item);
  }
}
