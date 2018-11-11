import {HandleData} from "./src/client/app/shared/services/handle-data";
import * as moment from "moment";
import * as fs from "fs";
// import * as _ from 'lodash';

const fio = HandleData.fieldsOrNotConcat([1, '', 5, null]);

console.assert(fio === '1 5', 'HandleData.fieldsOrNotConcat', fio, fio.length);

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
console.assert(line2 === o, 'HandleData.allocateTextToLine', line2);
console.assert(line3 === oo, 'HandleData.allocateTextToLine', line3);

const FIO = HandleData.getFIO(['123', '4567', '890']);
console.assert(FIO === '123 48', 'HandleData.getFIO', FIO);
const _FIO = HandleData.getFIO([null, '4567', '890']);
console.assert(_FIO === null, 'HandleData.getFIO', FIO);

console.assert(moment(new Date('2018-09-04 00:00:00.000000 +00:00')).format('DD.MM.YYYY') === '04.09.2018');

