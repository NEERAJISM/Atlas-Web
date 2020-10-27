import { Address } from './Address';

export class Client {
  id: string;

  name: string;
  pan: string;
  gst: string;

  mobile: string;
  email: string;

  addresses: Address[];
}
