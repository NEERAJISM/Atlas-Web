import { Component } from '@angular/core';
import { FirebaseUtil } from 'src/app/core/firebaseutil';
import { Address } from '../../../models/address';
import { Client } from '../../../models/client';

@Component({
  selector: 'new-client-dialog',
  templateUrl: 'new.client.component.html',
  styleUrls: ['./new.client.component.scss'],
})
export class NewClientComponent {
  client: Client;

  constructor(public fbutil: FirebaseUtil) {
    this.client = new Client();
    this.client.address = new Address();
  }

  submit() {
    const id = this.fbutil.getId();

    this.client.id = id;
    this.fbutil
      .getClientRef('bizId')
      .doc(id)
      .set(this.fbutil.toJson(this.client))
      .then((res) => console.log(res))
      .catch((err) => console.log(err));
  }
}
