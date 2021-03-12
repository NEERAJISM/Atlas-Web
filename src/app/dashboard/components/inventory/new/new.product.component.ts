import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonUtil } from '@core/common.util';
import { FirebaseUtil } from '@core/firebaseutil';
import { Product, Unit } from '@core/models/product';

@Component({
  selector: 'new-product-dialog',
  templateUrl: 'new.product.component.html',
  styleUrls: ['./new.product.component.scss'],
})
export class NewProductComponent {
  product: Product;
  action = 'Add Product';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data,
    public fbutil: FirebaseUtil,
    public commonUtil: CommonUtil
  ) {
    if (data) {
      this.product = data;
      this.action = 'Update Product';
    } else {
      this.product = new Product();
      this.product.units = [];
      this.product.units.push(new Unit());
    }
  }

  submit() {
    this.product.id =
      this.product.id && this.product.id.length > 0
        ? this.product.id
        : this.fbutil.getId();

    this.fbutil
      .getProductRef('bizId')
      .doc(this.product.id)
      .set(this.fbutil.toJson(this.product))
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }

  addNewUnit() {
    if (this.isValidUnits()) {
      this.product.units.push(new Unit());
    } else {
      this.commonUtil.showSnackBar('Invalid units added!');
    }
  }

  removeUnit(index: number) {
    if (this.product.units.length === 1) {
      this.commonUtil.showSnackBar('Atleast one unit required!');
    } else {
      this.product.units.splice(index, 1);
    }
  }

  isValidUnits(): boolean {
    let isValid = true;
    this.product.units.forEach((unit) => {
      if (
        !(
          unit.unit &&
          unit.unit.length > 0 &&
          unit.price &&
          unit.price >= 0 &&
          unit.stock &&
          unit.stock >= 0
        )
      ) {
        isValid = false;
        return;
      }
    });
    return isValid;
  }
}
