export class Order {
  id: string;
  vId: string;

  userId: string;
  bizId: string;

  createdTimeUTC: number;
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

  // TODO Address details

  // TODO payment gateway details

  constructor() { }
}

export class Item {
  id: string;
  name: string;

  // Biz Item photo url

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

export enum Status {
  New = 'New',
  Cancel = 'Cancel',
  Reject = 'Reject',
  Accept = 'Accept',
  Progress = 'Progress',
  Transit = 'Transit',
  Complete = 'Complete',
  Return = 'Return',
  ReturnAccept = 'ReturnAccept',
  ReturnComplete = 'ReturnComplete',
}
