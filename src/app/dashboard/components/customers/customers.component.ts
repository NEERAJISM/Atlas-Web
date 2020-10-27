import { Component } from '@angular/core';
import { Client } from '../../models/client';

import { AngularFirestore } from '@angular/fire/firestore';
import { Address } from '../../models/Address';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersDashboardComponent {
  client: Client;

  constructor(private firestore: AngularFirestore) {
    this.client = new Client();
    this.client.name = 'Damini';
    this.client.pan = 'ABCDEFD251K';
    this.client.email = '8patidarneeraj@gmail.com';
    this.client.mobile = '+91-8877073059';

    const address = new Address();
    address.line1 = 'co Balkrishna Patidar, Gamda Brahmaniya';
    address.line2 = 'Sagwara';
    address.pin = 314025;
    this.client.addresses = [];
    this.client.addresses.push(address);
  }

  addClients() {
    const id = this.firestore.createId();

    this.client.id = id;

    const json = JSON.parse(JSON.stringify(this.client));

    this.firestore
      .collection('Clients')
      .doc('BizId')
      .collection('Clients')
      .doc(id)
      .set(json)
      .then(
        (res) => console.log('Success - ' + json),
        (err) => console.log(err)
      );

    let c = new Client();

    this.firestore
      .collection('Clients')
      .doc('BizId')
      .collection('Clients')
      .get()
      .forEach((res) =>
        res.forEach((data) => {
          Object.assign(c, data.data());
          console.log(c);
        })
      );
  }
}
