/////////// REMEMBER TO SAVE EVERY BYTE OF STORAGE ///////////

export class User {
  id: string;

  email: string;
  mobile: string;
  password: string;

  firstName: string;
  lastName: string;

  businesses: Map<string, Role>;

  // TODO add link signature bitmap
}

enum Role {
  OWNER,
  CO_OWNER,
  ASSOCIATE,
  ACCOUNTANT,
  STAFF,
}
