import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';

import { Product, Unit } from '@core/models/product';


class CartItem {
  qty = 1;
  unit = '';
}


@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  isOrderSection = false;
  isCheckoutSection = false;

  items: Product[] = [];

  cartMap: Map<number, CartItem> = new Map();

  constructor(private location: Location, private router: Router) {
    this.init();
    this.isOrderSection = (router.url === '/profile#order');
  }

  init() {
    let unit1 = new Unit();
    unit1.unit = "500 gm";

    let unit2 = new Unit();
    unit2.unit = "1 kg";

    let unit3 = new Unit();
    unit3.unit = "5 kg";

    const product1 = new Product();
    product1.name = 'Veg Pasta';
    product1.units.push(unit1);
    product1.units.push(unit2);
    product1.units.push(unit3);
    product1.photoUrl.push('assets/images/profile/food1.jpg');

    const product2 = new Product();
    product2.name = 'French Toast';
    product2.units.push(unit1);
    product2.units.push(unit2);
    product2.units.push(unit3);
    product2.photoUrl.push('assets/images/profile/food2.jpg');

    const product3 = new Product();
    product3.name = 'Yoghurt';
    product3.units.push(unit1);
    product3.units.push(unit2);
    product3.units.push(unit3);
    product3.photoUrl.push('assets/images/profile/food3.jpg');

    const product4 = new Product();
    product4.name = 'Pancake';
    product4.units.push(unit1);
    product4.units.push(unit2);
    product4.units.push(unit3);
    product4.photoUrl.push('assets/images/profile/food4.jpg');

    this.items.push(product1);
    this.items.push(product2);
    this.items.push(product3);
    this.items.push(product4);
    this.items.push(product4);
    this.items.push(product4);
    this.items.push(product4);
    this.items.push(product4);
    this.items.push(product4);
  }

  home() {
    document.documentElement.scrollTop = 0;
    this.isOrderSection = false;
  }

  order() {
    this.location.replaceState('profile#order');
    document.documentElement.scrollTop = 0;
    this.isOrderSection = true;
  }

  checkout() {
    document.documentElement.scrollTop = 0;
    this.isCheckoutSection = true;
  }

  addToCart(i: number) {
    if (this.cartMap.has(i)) {
      this.cartMap.get(i).qty++;
    } else {
      const item = new CartItem();
      item.unit = this.items[i].units[0].unit;
      this.cartMap.set(i, item);
    }
  }

  removeFromCart(i: number) {
    this.cartMap.get(i).qty--;
    if (this.cartMap.get(i).qty === 0) {
      this.cartMap.delete(i);
    }
  }
}
