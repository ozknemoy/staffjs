import * as _ from 'lodash/core';

export class PrintHelpers {

  static addEmptyRow(table: (string | number)[][], rowAmount: number): any[][] {
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
    }
    return table;
  }
}
