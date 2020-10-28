import { Component } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatDialog } from '@angular/material/dialog';
import { Client } from '../../models/client';
import { NewClientComponent } from './newclient/new.client.component';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
})
export class CustomersDashboardComponent {
  client: Client;

  constructor(private firestore: AngularFirestore, public dialog: MatDialog) {}

  fetchClients() {
    const c = new Client();

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

  addNewClient() {
    this.dialog.open(NewClientComponent, {
      position: { top: '20px' },
    });
  }
}
