import { Data } from "./data";

export class Feature {
  public name: string;
  public data: Array<Data>;
  public min: number;
  public max: number;
  public mean: number;

  public constructor(n: string) {
    this.name = n;
    this.data = new Array<Data>();
  }

  public size(): number {
    return this.data.length;
  }

  public addData(d: number): void {
    this.data.push(new Data(d));
    let sortedData: Array<Data> = this.data.sort((a: Data, b: Data) => {
      if (a > b) {
        return 1;
      }

      if (a < b) {
        return -1;
      }

      return 0;
    });

    this.min = sortedData[0].value;
    this.max = sortedData[sortedData.length - 1].value;
    this.mean = 0;

    for (let _d of this.data) {
      this.mean += _d.value;
    }

    this.mean = this.mean / this.size();

    for (let _d of this.data) {
      _d.scaled = (_d.value - this.mean) / (this.max - this.min);
    }
  }
}
