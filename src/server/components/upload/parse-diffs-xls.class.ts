
import * as fs from "fs";
import * as _ from "lodash";
import xlsx from 'node-xlsx';
import {ErrHandler} from "../../services/error-handler.service";
import {HandleData} from '../../../shared/handle-data';
import IQualImprovement from "../personnel/relations/personnel-qual-improvement.interface";

export interface IParsedQualification {
  surname: string,
  name: string,
  middleName: string,
  rows: Partial<IQualImprovement>[]//{id?: number, endEduDate: string, type: string}[]
}

export class ParseXls {
  static parseQualification() {
    try {
      const firstList = xlsx.parse(fs.readFileSync('./qual-up.xls'))[0];
      const parsedArr = firstList.data.slice(1).map((row, i) => this.parseRow(row)).filter(row => !!row);
      return this.createDedupedQualification(parsedArr)
    } catch (e) {
      ErrHandler.throw('Ошибка чтения/разбора файла qual-up.xls', 500);
    }
  }

  static createDedupedQualification(arr: any[]): IParsedQualification[] {
    let ret = {};
    arr.forEach(row => {
      const rowQual: IParsedQualification['rows'][0] = {
        endEduDate: row.endEduDate,
        type: row.type,
      };
      if(ret[row.index]) {
        (ret[row.index].rows).push(rowQual)
      } else {
        ret[row.index] = <IParsedQualification>{
          surname: row.surname,
          name: row.name,
          middleName: row.middleName,
          rows: [rowQual],
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



