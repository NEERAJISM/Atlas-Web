export class Order {
  id: string;
  vId: string;

  userId: string;
  bizId: string;

  status: OrderStatus[] = [];

  items: Item[] = [];

  packagingCharges: number;
  deliveryCharges: number;

  otherCharges: number;
  otherChargesDesc: string;

  chargesTax: number;
  chargesTaxPercent: number;

  totalTaxableValue: number;
  totalTax: number;
  total: number;

  constructor() { }
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
}

export class OrderStatus {
  status: Status;
  time: number;
}

enum Status {
  New,
  Cancel,
  Reject,
  Accept,
  Progress,
  Transit,
  Complete,
  Return,
  ReturnAceept,
  ReturnComplete,
}
