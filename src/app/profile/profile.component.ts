import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


import { Product, Unit } from '@core/models/product';
import { Constants } from '@core/constants';
import { Client } from '@core/models/client';


class CartItem {
  name = '';
  qty = 1;
  unit = '';
  price = 0;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {

  isOrderSection = false;
  isCheckoutSection = false;

  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;

  items: Product[] = [];

  cartMap: Map<number, CartItem> = new Map();

  // Client form
  client = new Client();
  shippingAddressSame = true;

  customerNext = false;
  addressNext = false;

  states = Constants.states;

  constructor(private location: Location, private router: Router, private _formBuilder: FormBuilder) {
    this.init();
    this.isOrderSection = (router.url === '/profile#order');
  }

  ngOnInit() {
    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
  }

  init() {
    const unit1 = new Unit();
    unit1.unit = '500 gm';
    unit1.price = 500;

    const unit2 = new Unit();
    unit2.unit = '1 kg';
    unit2.price = 1000;

    const unit3 = new Unit();
    unit3.unit = '5 kg';
    unit3.price = 2500;

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
    this.isCheckoutSection = false;
  }

  order() {
    this.location.replaceState('profile#order');
    document.documentElement.scrollTop = 0;
    this.isOrderSection = true;
  }

  checkout() {
    if (!this.isOrderSection) {
      this.order();
    }
    document.documentElement.scrollTop = 0;
    this.isCheckoutSection = true;
  }

  goBackToOrderSection() {
    this.isCheckoutSection = false;
    this.customerNext = false;
    this.addressNext = false;
  }

  addToCart(i: number) {
    if (this.cartMap.has(i)) {
      this.cartMap.get(i).qty++;

      this.items[i].units.forEach((unit) => {
        if (unit.unit == this.cartMap.get(i).unit) {
          this.cartMap.get(i).price = this.cartMap.get(i).qty * unit.price;
        }
      });

    } else {
      const item = new CartItem();
      item.name = this.items[i].name;
      item.unit = this.items[i].units[0].unit;
      item.price = this.items[i].units[0].price;
      this.cartMap.set(i, item);
    }
  }

  removeFromCart(i: number) {
    this.cartMap.get(i).qty--;
    if (this.cartMap.get(i).qty === 0) {
      this.cartMap.delete(i);

      if(this.cartMap.size === 0) {
        this.isCheckoutSection = false;
      }
    } else {
      this.items[i].units.forEach((unit) => {
        if (unit.unit == this.cartMap.get(i).unit) {
          this.cartMap.get(i).price = this.cartMap.get(i).qty * unit.price;
        }
      });
    }
  }

  unitChange(i: number, value: string) {
    this.items[i].units.forEach((unit) => {
      if (unit.unit == value) {
        this.cartMap.get(i).price = this.cartMap.get(i).qty * unit.price;
      }
    });
  }

  itemsNext(){
    this.setFocus('customer-name');
  }
  
  customerNextStep(){
    this.customerNext = true;
    this.setFocus('address-1');
  }

  addressNextStep(){
    this.addressNext = true;
    this.setFocus('place-order-back');
  }

  addressBackStep(){
    this.customerNext = false;
    this.addressNext = false;
  }

  placeOrderBackStep(){
    this.addressNext = false;
  }

  placeOrder(){
    window.alert("Order Placed successfuly!!!");
    //TODO Show referenece number / send email to customer
  }

  checkboxClick(){
    // still has previous value
    if(this.shippingAddressSame) {
      this.addressNext = false;
    }
  }

  setFocus(id: string) {
    let targetElem = document.getElementById(id);
    setTimeout(function waitTargetElem() {
      if (document.body.contains(targetElem)) {
        targetElem.focus();
      } else {
        setTimeout(waitTargetElem, 100);
      }
    }, 100);
  }

}
