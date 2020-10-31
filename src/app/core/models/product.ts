export class Product {
  id: string;

  name: string;
  desc: string;
  serial: string;

  // TODO add [] of photos

  units: Unit[];
}

export class Unit {
  unit: string;
  price: number;
  stock: number;
}
