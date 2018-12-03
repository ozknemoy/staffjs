import {HttpHeaders} from '@angular/common/http/src/headers';
import * as moment from "moment";
import * as _ from 'lodash';
import {IPersonnel} from "../server/components/personnel/personnel.interface";


declare const Set;
const _cf = (function () {
  function _shift(x) {
    const parts = x.toString().split('.');
    return (parts.length < 2) ? 1 : Math.pow(10, parts[1].length)
  }

  return function (...rest) {
    return Array.prototype.reduce.call(rest, function (prev, next) {
      return prev === undefined || next === undefined || prev === null || next === null?
        undefined : Math.max(prev, _shift(next))
    }, -Infinity)
  };
})();

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
  static toKeyProp<T, V>(obj: T[], proOne: keyof T, propTwo: keyof T): {[key: string]: V} {
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
  // -> 2018-09-07T21:00:00.000Z
  static dateToServer(date: string) {
    //return (date && typeof date === 'string') ? new Date(date).toJSON() : null;
    return this.onlyDayToServer(date)
  }

  // -> 2017-02-07
  static dateFromServer(date: string) {
    //console.log(date, ' FromServer ->', date ? moment(date).format('YYYY-MM-DD') : date);
    return date ? moment(date).format('YYYY-MM-DD') : date;
  }

  // 2015-03-04T00:00:00.000Z //Complete ISO-8601 date
  // '2018-01-01' -> '1969-12-31T00:00:00+03:00'
  static onlyDayToServer(date, formatIn = 'YYYY-MM-DD') {
    if (!date) {
      return null;
    }
    //console.log(date, ' ToServer -> ', moment(date, formatIn).format());
    return moment(date, formatIn).format()
  }

  // 2018 -> 2017-12-31T00:00:00+03:00
  static setYear(year: string | number) {
    if (!year) {
      return null;
    }

    return HandleData.onlyDayToServer([year, 0, 1, 0, 0, 0, 0], null)
  }

  // 13.11.2018 -> 2018-11-12T21:00:00.000Z
  static ruDateToServer(date: string) {
    return this.isRuDate(date) ? this.onlyDayToServer(date, 'DD-MM-YYYY') : null
  }

  static isRuDate(date): boolean {
    if(typeof date !== 'string') {
      return null
    }
    return /^\d\d\.\d\d\.\d\d\d\d$/.test(date.trim().replace(/-/g, '.'))
  }

  // -> 2018-09-07
  static dateSubtractN(n: number, date: any, unit = 'year') {
    return /*this.dateToServer*/(moment(date).subtract(<any>n, unit).format('YYYY-MM-DD'))
  }

  // 2019-08-30T21:00:00.000Z -> true
  static isISODate(date): boolean {
    return /^\d\d\d\d-\d\d-\d\dT\d\d:/.test(date)
  }

  // таким время вылетает из бд. оно отличается от того что лежит в бд
  // Tue Feb 07 2017 00:00:00 GMT+0300 (Калининградское время (зима) -> true
  static isServerRawDate(date): boolean {
    return /\d\d\s\d\d\d\d\s\d\d:\d\d:\d\d\sGMT(\+|\-)\d\d\d\d\s/.test(date)
  }

  static copy<T>(a: T): T {
    return JSON.parse(JSON.stringify(a))
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

  // '2019-08-30T21:00:00.000Z' -> '31.08.2019' учитывает пояс
  static getRuDate(date) {
    return date ? moment(new Date(date)).format('DD.MM.YYYY') : null
  }
  // Tue Feb 07 2017 00:00:00 GMT+0300 -> '31.08.2019' учитывает пояс
  static getRuDateFromRaw(date) {
    return date ? moment(new Date(date)).format('DD.MM.YYYY') : null
  }

  static getRuDateWithoutDays(date) {
    return date ? moment(new Date(date)).format('MM.YYYY') : null
  }

  // (имя,6) -> имя____
  static getUnderlined(str: string | number, length: number, forceUnderline?, addTab = false): string {
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
    if(addTab) {
      str += '\t'
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

  static fieldsOrNot(f: string | number | Date | (string | number | Date)[]) {
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

  static fieldsOrNotConcat<T>(f: (string | number | Date)[], glue: string = ' '): string {
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

  /* раскидывает текст по рядам
  * [123, 567, 890],[__________, ____________, ______________] -> [123 567, 890, __________]
  * */
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

  // ['123', '4567', '890'] -> '123 48'
  static getFIO([f, i, o], short = true): string {
    // отчества может не быть
    if (HandleData.isNoValue(f) || HandleData.isNoValue(i)) {
      return null
    }
    if (short) {
      i = HandleData.isNoValue(i) ? '' : i.charAt(0);
      o = HandleData.isNoValue(o) ? '' : o.charAt(0);
    }
    return `${f} ${i}${short ? '' : ' '}${o}`
  }

  // 1111 2222 3333 4444 , 3 -> ['1111','2222','3333 4444']
  static splitByN(_str, n, splitter = ' ') {
    const strArr = _str.split(splitter);
    let out = [];
    for (let i = 0; i < strArr.length; i++) {
      if (strArr[i]) {
        // пишем лишнее в последний элемент разбивая с помощью splitter
        if (i > n - 1) {
          out[n - 1] = out[n - 1] + splitter + strArr[i]
        } else {
          out.push(strArr[i])
        }
      } else {
        out.push('')
      }
    }
    return out
  }

  static isInvalidPrimitive(value) {
    return value === null || value === undefined || value === '' || (typeof value === 'string' && value.trim() === '')
  }

  static isInvalidValue(value) {
    return this.isInvalidPrimitive(value) || (Array.isArray(value) && !value.length)
  }

  static getValidValue(value, defaultValue) {
    return this.isInvalidValue(value) ? defaultValue : value
  }

  static parseNumber(value: any): number {
    if (this.isInvalidPrimitive(value)) {
      return null
    }
    if (typeof value === 'number') {
      return value;
    } else if (typeof value === 'string') {
      value = value.replace(',', '.');
    }
    if (parseFloat(value) == value) {
      return parseFloat(value)
    }
    return null
  }
// вернет {}  если returnEmtyObject true
  static where<T>(arr: T[], attr: keyof T, value, returnEmtyObjectIfNotFound: boolean): {[attr: string]: any} {
    if (!arr.length || !attr || value  === null || value === undefined) {
      return returnEmtyObjectIfNotFound ? {[attr]: null} : null;
    }
    const ret = arr.find(function (obj) {
      if (obj[attr] == value) return true
    });
    return ret ? ret : (returnEmtyObjectIfNotFound ? {[attr]: null} : null)
  }

  static onlyEmptyKeys(obj: Object) {
    if(HandleData.isNoValue(obj)) {
      return true
    }
    return !_.values(obj).some(v => !HandleData.isNoValue(v))
  }

  // 137\17 от23.03.2017 -> ['137\17', '23.03.2017']
  // если не получается разделить то все равно верну значение первым аргументом при returnSourceIfFail = true
  // 137\17 23.03.2017 -> ['137\17 23.03.2017', null]
  static splitByDivider(str: string, divider: string, returnSourceIfFail: boolean): [string, string] {
    if(this.isInvalidPrimitive(str)) {
      return [null, null]
    }
    if(str.indexOf(divider) > -1) {
      let [a, b] = str.split(divider);
      a = this.isInvalidPrimitive(a) ? null : a.trim();
      b = this.isInvalidPrimitive(b) ? null : b.trim();
      return [a, b]
    } else if (str.indexOf(divider) === -1 && returnSourceIfFail) {
      return [str, null]
    }
    return [null, null]
  }

  // пока не обрабатываю ситуацию когда все колонки пусты
  // первый ряд не участвует в проверке на заполненость
  static clearEmptyColumns(tbl: (string | number)[][]): (string | number)[][] {
    const tblWithoutHeader = tbl.slice(1);
    let emptyColumns = [];
    tblWithoutHeader[0].forEach((cell, columnIndex) => {
      if(tblWithoutHeader.every(row => this.isNoValuePrimitive(row[columnIndex]))) {
        emptyColumns.push(columnIndex)
      }
    });
    if(!emptyColumns.length) {
      return tbl
    }
    return tbl.map(row =>
      row.filter((cell, columnIndex) => !_.includes(emptyColumns, columnIndex))
    )
  }

  static handleSalary(salaryDict): {[key: string]: number} {
    return HandleData.toKeyProp<any, number>(salaryDict, 'value', 'salary');
  }

  // считаю зп на лету
  static addCountedSalary(worker: IPersonnel, dict: {[key: string]: number}) {
    worker.workplaces.forEach(wp => {
      if(wp.category && dict[wp.category]/*тут сработает проверка и на ноль*/ && wp.rate) {
        wp.salary = HandleData.multiply(wp.salaryCoef, dict[wp.category], wp.rate)
      }

    });
    return worker
  }

  static precise(number, n?) {
    return parseFloat(parseFloat('' + number).toPrecision(n || 15))
  }

  static _isCountable(a, b) {
    return !!a && !!b
  }

  static _getCountable(a) {
    return  a? HandleData.precise(a) : 0
  }

  static sum(...rest) {
    rest = rest.map(this._getCountable);
    const f = _cf.apply(null, rest);

    if (f === undefined) return;
    function cb(x, y) {
      return x + f * y
    }
    return Array.prototype.reduce.call(rest, cb, 0) / f
  }

  static subtract(l, r) {
    l = this._getCountable(l);
    r = this._getCountable(r);
    const f = _cf(l, r);
    // добавил сюда multiply иначе не работало
    return (this.multiply(l * f) - this.multiply(r * f)) / f
  }

  static multiply(...rest) {
    rest = rest.map(this._getCountable);
    const f = _cf.apply(null, rest);

    function cb(x, y) {
      return (x * f) * (y * f) / (f * f)
    }

    return Array.prototype.reduce.call(rest, cb, 1)
  }

  static divide(l, r) {
    if(!this._isCountable(l, r)) return 0;
    const f = _cf(l, r);
    return (l * f) / (r * f);
  }
}
