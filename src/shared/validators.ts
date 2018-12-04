import {HandleData} from "./handle-data";
import {Sequelize} from "sequelize-typescript";


export const phoneRegExp = /\d{11,13}/;
export const innRegExp = /\d{10,10}/;


export function invalidINN(inn: string): boolean {
  // разрешаю null and ''
  if (inn === null || inn === '') {
    return false
  }
  return (!innRegExp.test(inn) || inn.length !== 10);
}

export function validateINN(inn: string) {
  if (invalidINN(inn)) {
    throw new Error(`Вы ввели не валидный ИНН "${inn}". Введите 10 цифр`);
  }
}

export function hasValue(val: any, msg: string,) {
  if (HandleData.isNoValuePrimitive(val)) {
    throw new Error(msg);
  }
}

export const opHasValue = {[Sequelize.Op.regexp]: '\.'};
export const opAll = {[Sequelize.Op.gt]: 0};
// can't do an equal compare with a NULL value -> use Is (not IN (null, 0))
// то же самое наоборот нельзя IS использовать с 0
export const opZeroOrNull = {[Sequelize.Op.or]: [{[Sequelize.Op.eq]: 0},{[Sequelize.Op.is]: null}]};