import { Address } from './address';

export class Client {
  id: string;

  name: string;
  pan: string;
  gst: string;

  mobile: string;
  email: string;

  address: Address = new Address();

  // TODO replace invoice component
  shippingAddress: Address = new Address();
}
