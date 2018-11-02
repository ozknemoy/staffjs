

export const phoneRegExp = /\d{11,13}/;
export const innRegExp = /\d{10,10}/;


export function invalidINN(inn: string): boolean {
  return (!innRegExp.test(inn) || inn.length !== 10) && !!inn;
}

export function validateINN(inn: string) {
  if (invalidINN) {
    throw new Error(`Вы ввели не валидный ИНН "${inn}". Введите 10 цифр`);
  }
}


