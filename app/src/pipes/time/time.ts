import { Pipe, PipeTransform } from "@angular/core";

/**
 * Generated class for the TimePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: "time"
})
export class TimePipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
  transform(value: number, ...args): string {
    let min = value % 60;
    let hr = Math.floor(value / 60);
    if (hr == 0) {
      return min + " min";
    }
    return hr + " h:" + min + " min";
  }
}
