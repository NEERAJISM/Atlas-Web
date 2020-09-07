/////////// REMEMBER TO SAVE EVERY BYTE OF STORAGE ///////////

export class Invoice {
  id: string;

  invoiceNo: string;
  isDraft: boolean;

  // Only allow single versions in draft mode
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
    this.sNo = copy.sNo;

    this.itemId = copy.itemId;
    this.name = copy.name;
    this.serial = copy.serial;

    this.qty = copy.qty;
    this.unit = copy.unit;

    this.price = copy.price;

    this.discount = copy.discount;
    this.discountPercent = copy.discountPercent;
    this.taxPercent = copy.taxPercent;

    this.total = copy.total;
  }

  sNo: string;

  itemId: string;
  name: string;
  serial: string;

  qty: number;
  unit: string;

  price: number;

  discount: number;
  discountPercent: number;
  taxPercent: number;

  total: number;
}
