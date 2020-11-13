/////////// REMEMBER TO SAVE EVERY BYTE OF STORAGE + keep simple + primitive ///////////

export class Invoice {
  id: string;

  invoiceNo: string;
  isDraft: boolean;

  // Only single version in draft mode
  allVersions: InvoiceVersion[];
}

export class InvoiceVersion {
  constructor(copy: InvoiceVersion) {
    this.createdTime = copy.createdTime;
    this.lastUpdatedTime = copy.lastUpdatedTime;

    copy.items.forEach((item) => this.items.push(new Item(item)));

    this.packagingCharges = copy.packagingCharges;
    this.deliveryCharges = copy.deliveryCharges;
    this.otherCharges = copy.otherCharges;
    this.otherChargesDesc = copy.otherChargesDesc;

    this.chargesTax = copy.chargesTax;
    this.chargesTaxPercent = copy.chargesTaxPercent;

    this.totalTaxableValue = copy.totalTaxableValue;
    this.totalTax = copy.totalTax;
    this.total = copy.total;

    this.toBePaidWithinDays = copy.toBePaidWithinDays;
    this.isPaid = copy.isPaid;
    this.signId = copy.signId;
  }

  createdTime: string;
  lastUpdatedTime: string;

  invoiceDate: string;
  dueDate: string;

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

  toBePaidWithinDays: number;
  isPaid: boolean;

  signId: string;
}

export class Item {
  constructor(copy: Item) {
    this.id = copy.id;
    this.name = copy.name;

    this.qty = copy.qty;
    this.unit = copy.unit;

    this.price = copy.price;

    this.discount = copy.discount;
    this.tax = copy.tax;
    this.taxPercent = copy.taxPercent;

    this.total = copy.total;
  }

  id: string;
  name: string;

  unit: string;
  price: number;

  qty: number;

  discount: number;
  tax: string;
  taxPercent: number;

  total: number;
}

export class InvoiceAddress {
  line1: string;
  line2: string;
  pin: number;
  district: string;
  state: string;
}
