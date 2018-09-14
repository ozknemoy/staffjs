import {HttpHeaders} from '@angular/common/http/src/headers';
import * as moment from "moment";


declare const Set;

export interface ISimpleObj {
  [key: string]: string
}

export class HandleData {

  static getFileNameFromHttpResponse(httpResponse) {
    const contentDispositionHeader = decodeURIComponent((<HttpHeaders>httpResponse.headers).get('Content-Disposition'));
    const result = contentDispositionHeader.split(';')[1].trim().split('=')[1];
    return result.replace(/"/g, '');
  }

// [{[proOne]:2, [propTwo]: 'изменение'}] -> {[proOneValue]:[propTwoValue]}
  static toKeyProp(obj: any[], proOne = 'id', propTwo = 'name'): ISimpleObj {
    let o = {};
    obj.forEach(row => {
      o[row[proOne].toString()] = row[propTwo];
    });
    return o;
  }

  static constructUrl(mainChunk, params) {
    let chunk = '';
    for (let prop in params) {
      if (params[prop] !== null && params[prop] !== undefined) {
        const _chunk = prop + '=' + params[prop];
        chunk = chunk === '' ? '?' + _chunk : chunk + '&' + _chunk;
      }
    }
    return mainChunk + chunk;
  }


  static getMatches(string, regex, index = 1 /*default to the first capturing group*/): any[] {
    if (!string) return [];
    let matches = [];
    let match;
    while (match = regex.exec(string)) {
      matches.push(match[index]);
    }
    return matches;
  }

  // проверяет уникальность полей в массиве. null это nj;t уникальное значение
  static arrayHasUniqueFields(array: any[], ...fields: string[]): boolean {
    const valueArr = array.map(row => (fields.map(field => row[field])).toString());
    // откидываю повторяющиеся значения
    const deduped = [...Array['from'](new Set(valueArr))];
    return valueArr.length === deduped.length;
  }

  // https://blog.theodo.fr/2018/01/tips-tricks-date-handling-moment-js/
  static dateToServer(date: string) {
    return (date && typeof date === 'string') ? moment(date).utc() : null;
  }

  static dateFromServer(date: string) {
    return date ? moment(date).format('YYYY-MM-DD') : date;
  }

  static copy<T>(arr: T[]): T[] {
    return JSON.parse(JSON.stringify(arr))
  }

  static handleDatesInObjectToServer<T>(obj: T, stringsArr: (keyof T)[]) {
    stringsArr.forEach( (str) => {
        obj[str] = <any>HandleData.dateToServer(<any>obj[str])
    });
    return obj
  };

  static handleDatesInObjectFromServer<T>(obj: T, stringsArr: (keyof T)[]) {
    stringsArr.forEach( (str) => {
      obj[str] = <any>HandleData.dateFromServer(<any>obj[str])
    });
    return obj
  };

  static handleDatesInArrToServer<T>(arr: T[], stringsArr: (keyof T)[]) {
    return HandleData.copy(arr).map( (row: T) => HandleData.handleDatesInObjectToServer(row, stringsArr));
  };

  static handleDatesInArrFromServer<T>(arr: T[], stringsArr: (keyof T)[]) {
    return HandleData.copy(arr).map( (row: T) => HandleData.handleDatesInObjectFromServer(row, stringsArr));
  };

  static getRuDate(date) {
    return date ? moment(date).format('DD.MM.YYYY') : null
  }
}
