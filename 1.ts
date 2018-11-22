import {HandleData} from "./src/client/app/shared/services/handle-data";
import * as moment from "moment";
import * as fs from "fs";
import * as _ from "lodash";
import {attractionTermsDict} from "./src/shared/dictionaries/attraction-terms.dict";
import {ParseXls} from './src/server/components/upload/parse-diffs-xls.class';


const fio = HandleData.fieldsOrNotConcat([1, '', 5, null]);

console.assert(fio === '1 5', 'fieldsOrNotConcat', fio, fio.length);

const line = '______________________________________________';
const f = '1111111111';
const i = '5555555555';
const o =    '99999999999999999999999999999999999999';
const oo = '0000000000 000000000000000';


const [l1, l2] =
  HandleData.allocateTextToLines([f, i], [line, line]);
console.assert(l1 === '1111111111 5555555555', 'allocateTextToLine', l1, typeof l1, l1.length );
const [line1, line2, line3] =
  HandleData.allocateTextToLines([f, i, o, oo], [line, line, line]);
console.assert(line1 === '1111111111 5555555555', '.allocateTextToLine', line1);
console.assert(line2 === o, 'allocateTextToLine', line2);
console.assert(line3 === oo, 'allocateTextToLine', line3);

const FIO = HandleData.getFIO(['123', '4567', '890']);
console.assert(FIO === '123 48', 'getFIO', FIO);
const _FIO = HandleData.getFIO([null, '4567', '890']);
console.assert(_FIO === null, 'getFIO', FIO);

console.assert(moment(new Date('2018-09-04 00:00:00.000000 +00:00')).format('DD.MM.YYYY') === '04.09.2018');


console.assert(HandleData.parseNumber(undefined) === null, 'parseNumber1', 1);
console.assert(HandleData.parseNumber('') === null, 'parseNumber2', 1);
console.assert(HandleData.parseNumber('7') === 7, 'parseNumber3', 1);
console.assert(HandleData.parseNumber('7,555 ') === 7.555, 'parseNumber4', 1);
console.assert(HandleData.parseNumber('ret') === null, 'parseNumber5', 1);
console.assert(HandleData.parseNumber(0.5) === 0.5, 'parseNumber6', 1);


console.assert(HandleData.onlyEmptyKeys({ret: '', tre: 1}) === false, 'onlyEmptyKeys1');
console.assert(HandleData.onlyEmptyKeys({ret: '', tre: null}) === true, 'onlyEmptyKeys2');
console.assert(HandleData.onlyEmptyKeys(null) === true, 'onlyEmptyKeys3');

const someDate = HandleData.dateSubtractN(1, [2018, 10, 18, 0, 0, 0, 0]);
console.assert(someDate === '2017-11-18', 'dateSubtractN', someDate);


const [a, b] = HandleData.splitByDivider('137\\17 от23.03.2017', 'от', true);
console.assert(a === '137\\17' && b === '23.03.2017', 'splitByDivider1');
const [c, d] = HandleData.splitByDivider('137\\17 о23.03.2017', 'от', true);
console.assert(c === '137\\17 о23.03.2017' && d === null, 'splitByDivider2');
const [e, g] = HandleData.splitByDivider('137\\17 о2', 'от', false);
console.assert(e === null && g === null, 'splitByDivider3', [e, g]);
const [h, k] = HandleData.splitByDivider('137\\17 от', 'от', true);
console.assert(h === '137\\17' && k === null, 'splitByDivider4');
const [j, p] = HandleData.splitByDivider('', 'от', false);
console.assert(j === null && p === null, 'splitByDivider5', [e, g]);


console.assert(HandleData.isServerDate('2019-08-30T21:00:00.000Z') === true, 'isServerDate1');
console.assert(HandleData.isServerDate('2019-0830T21:00:00.000Z') === false, 'isServerDate3');
