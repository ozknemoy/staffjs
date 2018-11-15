/**
 * Created by ozknemoy on 10.01.2017.
 */
import { Pipe } from '@angular/core';

function __parseDate(input, format = 'yyyy-mm-dd') {
  const parts = input.match(/(\d+)/g);
  let i = 0;
  const fmt = {};
  // extract date-part indexes from the format
  format.replace(/(yyyy|dd|mm)/g, (part) => fmt[part] = <any>(i++));
return new Date(parts[fmt['yyyy']], parts[fmt['mm']] - 1, parts[fmt['dd']]);
}

@Pipe({name: 'fromDateToDate'})
export class FromDateToDatePipe {
  transform(array: any[], st: string, en: string, key = 'date'): any[] {
    // todo isWithinRange 'date-fns'
    if (!array) {
      return undefined;
    }
    if (!st && !en) {
      return array;
    }
    const start = st ? +new Date(st) : 0;
    const end = en ? +new Date(en) : 7979472000000;

    return array.filter(item => {
      const med = +__parseDate(item[key]);
      return med >= start && med <= end;
    });
  }
}