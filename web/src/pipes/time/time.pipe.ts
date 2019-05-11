import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'time'
})
export class TimePipe implements PipeTransform {

  transform(value: any, args?: any): any {
    const min = value % 60;
    const hr = Math.floor(value / 60);
    if (hr === 0) {
        return (min < 10 ? '0' + min : min) + ' min';
    } else if (min === 0) {
        return hr + 'h';
    }
    return hr + ' h:' + (min < 10 ? '0' + min : min) + ' min';
  }

}
