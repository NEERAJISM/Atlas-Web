/////////// REMEMBER TO SAVE EVERY BYTE OF STORAGE + keep simple + primitive ///////////

export class Invoice {
  id: string;

  invoiceNo: string;
  isDraft: boolean;

  // Only single version in draft mode
  allVersions: InvoiceVersion[];
}

export class InvoiceVersion {
  createdTime: string;
  lastUpdatedTime: string;

  invoiceDate: string;
  dueDate: string;

  supplyState: string;
  supplyPlace: string;

  dueDays: number;

  customerName: string;
  id: string;
  mobile: number;
  email: string;

  billingAddress: InvoiceAddress;
  shippingAddress: InvoiceAddress;

  items: Item[];

  packagingCharges: number;
  deliveryCharges: number;

  otherCharges: number;
  otherChargesDesc: string;

  chargesTax: number;
  chargesTaxPercent: number;

  totalTaxableValue: number;
  totalTax: number;
  total: number;

  signId: string;

  constructor(copy: InvoiceVersion) {
    this.createdTime = copy.createdTime;
    this.lastUpdatedTime = copy.lastUpdatedTime;

    this.invoiceDate = copy.invoiceDate;
    this.dueDate = copy.dueDate;

    this.supplyState = copy.supplyState;
    this.supplyPlace = copy.supplyPlace;

    this.dueDays = copy.dueDays;


    this.customerName = copy.customerName;
    this.id = copy.id;
    this.mobile = copy.mobile;
    this.email = copy.email;

    this.billingAddress = new InvoiceAddress();
    this.billingAddress.copy(copy.billingAddress);

    this.shippingAddress = new InvoiceAddress();
    this.shippingAddress.copy(copy.shippingAddress);

    
    copy.items.forEach((item) => {
      const i = new Item();
      i.copy(item);
      this.items.push(i);
    });

    this.packagingCharges = copy.packagingCharges;
    this.deliveryCharges = copy.deliveryCharges;
    this.otherCharges = copy.otherCharges;
    this.otherChargesDesc = copy.otherChargesDesc;

    this.chargesTax = copy.chargesTax;
    this.chargesTaxPercent = copy.chargesTaxPercent;

    this.totalTaxableValue = copy.totalTaxableValue;
    this.totalTax = copy.totalTax;
    this.total = copy.total;

    this.signId = copy.signId;
  }
}

export class Item {
  id: string;
  name: string;

  unit: string;
  price: number;

  qty: number;

  discount: number;
  tax: string;
  taxValue: number;

  total: number;

  constructor() { }

  copy(copy: Item) {
    this.id = copy.id;
    this.name = copy.name;

    this.qty = copy.qty;
    this.unit = copy.unit;

    this.price = copy.price;

    this.discount = copy.discount;
    this.tax = copy.tax;
    this.taxValue = copy.taxValue;

    this.total = copy.total;
  }
}

export class InvoiceAddress {
  line1: string;
  line2: string;
  pin: number;
  district: string;
  state: string;

  copy(copy: InvoiceAddress) {
    this.line1 = copy.line1;
    this.line2 = copy.line2;
    this.pin = copy.pin;
    this.district = copy.district;
    this.state = copy.state;
  }
}