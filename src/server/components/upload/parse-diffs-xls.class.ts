
import * as fs from "fs";
import * as _ from "lodash";
import xlsx from 'node-xlsx';
import {ErrHandler} from "../../services/error-handler.service";
import {HandleData} from '../../../client/app/shared/services/handle-data';

export interface IParsedQualification {
  surname: string,
  name: string,
  middleName: string,
  rows: {id?: number, endEduDate: string, type: string}[]
}

export class ParseXls {
  static parseQualification(excelPath = './qual-up.xls') {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      const parsedArr = firstList.data.slice(1).map((row, i) => this.parseRow(row)).filter(row => !!row);
      return this.createDedupedQualification(parsedArr)
    } catch (e) {
      ErrHandler.throw('Ошибка чтения/разбора файла', e);
    }
  }

  static create(excelPath = './staff.xls') {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      return  this.parseRow(firstList.data[1]);
    } catch (e) {
      ErrHandler.catchPropagate('Ошибка чтения/разбора файла', e);
    }
  }

  static createDedupedQualification(arr: any[]): IParsedQualification[] {
    let ret = /*<IParsedQualification>*/{};
    arr.forEach(row => {
      if(ret[row.index]) {
        ret[row.index].rows.push({
          endEduDate: row.endEduDate,
          type: row.type,
        })
      } else {
        ret[row.index] = {
          surname: row.surname,
          name: row.name,
          middleName: row.middleName,
          rows: [{
            endEduDate: row.endEduDate,
            type: row.type,
          }],
        }
      }
    });

    return _.values(ret)
  }

  static parseRow(xls: string[]): {
    index: string,
    surname: string,
    name: string,
    middleName: string,
    endEduDate: string,
    type: string,
  } {
    const [surname, name, middleName] = HandleData.splitByN(xls[1], 3);
    if(!xls[3] && !xls[4]) {
      return null
    }
    return {
      index: xls[1],
      surname,
      name,
      middleName,
      endEduDate: HandleData.ruDateToServer(xls[3]),
      type: xls[4],
    }
  }


}



