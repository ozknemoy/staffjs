import {HttpHeaders} from '@angular/common/http/src/headers';
import * as moment from "moment";
import * as _ from 'lodash';


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

  static copy<T>(arr: T): T {
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

  static getRuDateWithoutDays(date) {
    return date ? moment(date).format('MM.YYYY') : null
  }

  // (имя,6) -> имя____
  static getUnderlined(str: string | number, length: number, forceUnderline?): string {
    if (HandleData.isNoValuePrimitive(str)) {
      str = '';
    } else {
      str = str.toString();
    }
    if (HandleData.isNoValuePrimitive(str) || forceUnderline) {
      while (str.length < length) {
        str += ' '
      }
    }

    return str
  }

  static sortArrById<T extends {id: number}>(arr: T[]): T[] {
    return arr.sort((a: T, b) => a.id > b.id ? 1 : -1)
  }

  static isNoValuePrimitive(value) {
    return value === null || value === undefined || value === '' || ((typeof value === 'string' && value.trim() === ''))
  }

  static isNoValue(value) {
    return HandleData.isNoValuePrimitive(value) || (Array.isArray(value) && !value.length)
  }

  static fieldsOrNot(f: string | number | (string | number)[]) {
    let str;
    if (f && Array.isArray(f) && !_.isEmpty(f)) {
      str = f.map(_f => !HandleData.isNoValuePrimitive(_f) ? (_f + '') : null).filter(_f => !HandleData.isNoValuePrimitive(_f))
    } else if (f && (typeof f === 'string' || typeof f === 'number')) {
      str = !HandleData.isNoValuePrimitive(f) ? f + '' : '';
    } else {
      str = ''
    }
    return str
  }

  static fieldsOrNotConcat<T>(f: (string | number)[], glue: string = ' '): string {
    return (<string[]>HandleData.fieldsOrNot(f)).join(glue);
  }

  static getTextOrDummy(text: string, dummy: string): string {
    return HandleData.isNoValue(text) ? dummy : text;
  }

  static addZeroToDate(n: number): string {
    return n < 10 ? '0' + n : n + '';
  }

  static getFullDate(_d?: string | Date): string {
    let fullDate = '«____»__________ 20___ г.';
    if (_d) {
      const d = new Date(<string>_d);
      fullDate = `«${HandleData.addZeroToDate(d.getDate())}»   ${HandleData.addZeroToDate(d.getMonth())}   ${d.getFullYear()} г.`;
    }
    return fullDate;
  }

  static allocateTextToLines(mainText: string[], dummyText: string[]) {
    if (_.isEmpty(mainText)) {
      return dummyText
    }
    const full = mainText.join(' ');
    // все влезает в первую линию
    if (dummyText[0].length >= full.length) {
      dummyText[0] = full;
    } else {

      for (let i = 0; i < dummyText.length; i++) {
        let temp = mainText;
        let _temp = temp.join(' ');
        // отбрасываю один элемент
        while (_temp.length > dummyText[i].length) {
          temp = _.dropRight(temp);
          _temp = temp.join(' ');
        }

        dummyText[i] = _temp;
        // остатки mainText
        mainText = mainText.slice(temp.length);
        if (!mainText.length) {
          break;
        }
      }
    }

    return dummyText
  }

  static getFIO([f, i, o], short = true): string {
    if (HandleData.isNoValue(f) || HandleData.isNoValue(i) || HandleData.isNoValue(o)) {
      return null
    }
    if (short) {
      i = HandleData.isNoValue(i) ? '' : i.charAt(0);
      o = HandleData.isNoValue(o) ? '' : o.charAt(0);
    }
    return `${f} ${i}${o}`
  }
}
