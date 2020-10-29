import { Address } from './Address';

/////////// REMEMBER TO SAVE EVERY BYTE OF STORAGE ///////////
export class Business {
  id: string;

  name: string;
  web: string;
  // TODO Array of images of business

  paid: boolean;
  expiry: string;

  users: string[];

  addresses: Address[];
}
