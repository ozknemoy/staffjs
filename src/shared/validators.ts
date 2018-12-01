import {HandleData} from "./handle-data";


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
  console.log(msg, val);
  if (HandleData.isNoValuePrimitive(val)) {
    throw new Error(msg);
  }
}

