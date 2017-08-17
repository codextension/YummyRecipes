import { Data } from "./data";

export class XYPair {
  public y: number;
  public x: Array<number>;

  public constructor(x: Array<number>, y: number) {
    this.x = new Array<number>();
    this.x.push(1); // adding x0 which has always the value 1
    this.x.concat(x);
    this.y = y;
  }
}
