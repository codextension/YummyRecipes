import { Comparable } from "./comparable";

export class Data implements Comparable {
  public value: number;
  public scaled: number;

  public constructor(v: number) {
    this.value = v;
  }

  equals(object: Data): boolean {
    return object.value == this.value;
  }
}
