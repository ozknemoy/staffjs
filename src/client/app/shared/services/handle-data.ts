import {HttpHeaders} from '@angular/common/http/src/headers';

/**
 * Created by Vakarchuk.DM on 13.09.2017.
 */

declare const Set;

export interface ISimpleObj {
  [key: string]: string
}

export class HandleData {

  constructor() {}

  static sliceByArrayOfNumbers(_str: string, _mask: number[], specialChar = '-', doNotCleanOlsSpecialChar = false): string {
    if (!_str || !_mask) return null;
    if (!doNotCleanOlsSpecialChar) _str = _str.replace(new RegExp(specialChar, 'g'), '');
    let str = '';
    let charNow = 0;
    const mask = [0].concat(_mask);
    mask.forEach(function (maskNum, i) {
      if (i < mask.length) {
        str = str + (i > 1 ? specialChar : '') + _str.slice(charNow, charNow + maskNum);
      }
      charNow += maskNum;
    });
    return str;
  }

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
    let deduped = [...Array['from'](new Set(valueArr))];
    return valueArr.length === deduped.length;
  }

}
