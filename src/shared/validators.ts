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

export const hasValueWhereOptions = {[Sequelize.Op.regexp]: '\.'};
/* следущее превращается в простую конструкцию NOT NULL то есть ne: '' игнорируется
{
  [Sequelize.Op.and]: {
    [Sequelize.Op.ne]: '',
    [Sequelize.Op.ne]: null
  }}*/
