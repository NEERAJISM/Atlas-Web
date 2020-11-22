import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreCollection,
} from '@angular/fire/firestore';
import { Constants } from './constants';

@Injectable()
export class FirebaseUtil {
  constructor(private firestore: AngularFirestore) {}

  getId(): string {
    return this.firestore.createId();
  }

  getClientRef(bizId: string): AngularFirestoreCollection {
    return this.firestore
      .collection(Constants.CLIENT_DB)
      .doc(bizId)
      .collection(Constants.CLIENTS);
  }

  getProductRef(bizId: string): AngularFirestoreCollection {
    return this.firestore
      .collection(Constants.PRODUCT_DB)
      .doc(bizId)
      .collection(Constants.PRODUCTS);
  }

  getInvoiceRef(bizId: string): AngularFirestoreCollection {
    return this.firestore
      .collection(Constants.INVOICE_DB)
      .doc(bizId)
      .collection(Constants.INVOICES);
  }

  toJson(obj: any) {
    return JSON.parse(JSON.stringify(obj));
  }
}
