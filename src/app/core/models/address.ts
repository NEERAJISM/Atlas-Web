export class Address {
  id: string;

  line1: string;
  line2: string;
  pin: number;
  district: string;
  state: string;

  lon: string;
  lat: string;

  copy(c: Address) {
    this.line1 = c.line1;
    this.line2 = c.line2;
    this.pin = c.pin;
    this.district = c.district;
    this.state = c.state;
    this.lon = c.lon;
    this.lat = c.lat;
  }
}