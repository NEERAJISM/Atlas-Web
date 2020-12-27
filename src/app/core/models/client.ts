import { Address } from './address';

export class Client {
  id: string;

  name: string;
  pan: string;
  gst: string;

  mobile: string;
  email: string;

  address: Address = new Address();

  copy(c: Client) {
    this.name = c.name;
    this.pan = c.pan;
    this.gst = c.gst;
    this.mobile = c.mobile;
    this.email = c.email;
    this.address.copy(c.address);
  }
}
