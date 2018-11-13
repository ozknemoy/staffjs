import * as _ from 'lodash/core';

export class PrintHelpers {

  static addEmptyRow(table: (string | number)[][], rowAmount: number, colAmount?: number): any[][] {
    if (!_.isEmpty(table) && table.length < rowAmount) {
      const columnAmount = table[0].length;
      const emptyRow = [];
      while (emptyRow.length < columnAmount) {
        emptyRow.push(' ');
      }
      while (table.length < rowAmount) {
        // каждый раз надо создавать новый массив тк копии библиотека игнорирует
        table.push(emptyRow.slice());
      }
      // если пустая таблица и есть количество рядов то тоже показываем пустые ряды
    } else if(_.isEmpty(table) && colAmount) {
      let td = new Array(colAmount);
      td.fill(' ');
      let row = new Array(rowAmount);
      row.fill(td);
      // каждый раз надо создавать новый массив тк копии библиотека игнорирует
      return row.map((td) =>  td.slice())
    }
    return table;
  }
}
