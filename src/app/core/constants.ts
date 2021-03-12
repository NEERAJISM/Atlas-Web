export class Constants {
  static SUCCESS = 'Success';
  static FAILURE = 'Failure';

  static AUTH_NO_USER = 'auth/user-not-found';
  static AUTH_INVALID_PASSWORD = 'auth/wrong-password';
  static AUTH_ALREADY_IN_USE = 'auth/email-already-in-use';

  // Firebase
  static USER_DB = 'UserDB';
  static CLIENT_DB = 'ClientDB';
  static PRODUCT_DB = 'ProductDB';
  static INVOICE_DB = 'InvoiceDB';
  static INVOICE_PREVIEW_DB = 'InvoicePreviewDB';

  static USERS = 'Users';
  static CLIENTS = 'Clients';
  static PRODUCTS = 'Products';
  static INVOICES = 'Invoices';
  static INVOICE_PREVIEWS = 'InvoicePreviews';

  static TAX_STRING_SGST = 'Tax (SGST + CGST)';
  static TAX_STRING_IGST = 'Tax (IGST)';

  static states: string[] = [
    'Andhra Pradesh',
    'Arunachal Pradesh',
    'Assam',
    'Bihar',
    'Chhattisgarh',
    'Goa',
    'Gujarat',
    'Haryana',
    'Himachal Pradesh',
    'Jammu and Kashmir',
    'Jharkhand',
    'Karnataka',
    'Kerala',
    'Madhya Pradesh',
    'Maharashtra',
    'Manipur',
    'Meghalaya',
    'Mizoram',
    'Nagaland',
    'Odisha',
    'Punjab',
    'Rajasthan',
    'Sikkim',
    'Tamil Nadu',
    'Telangana',
    'Tripura',
    'Uttarakhand',
    'Uttar Pradesh',
    'West Bengal',
    'Andaman and Nicobar Islands',
    'Chandigarh',
    'Dadra and Nagar Haveli',
    'Daman and Diu',
    'Delhi',
    'Lakshadweep',
    'Puducherry',
  ];
}
