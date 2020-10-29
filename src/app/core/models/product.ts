export class Product {
  id: string;

  name: string;
  serial: string;

  // TODO add [] of photos

  units: Unit[];
}

export class Unit {
  unit: string;
  price: number;
}
