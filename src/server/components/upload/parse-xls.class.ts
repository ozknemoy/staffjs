
import * as fs from "fs";
import xlsx from 'node-xlsx';
import {IPersonnel} from '../personnel/personnel.interface';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import {invalidINN} from '../../../shared/validators';

export class ParseXls {

  static createFromFile(file) {
    const w = xlsx.parse(file)[0];
    return  this.parse( w.data[1]);
  }

  static create(excelPath = './staff.xls') {
    const w = xlsx.parse(fs.readFileSync(excelPath))[0];
    return  this.parse(w.data[1]);
  }

  static splitByN(_str, n, splitter = ' ') {
    const strArr = _str.split(splitter);
    let out = [];
    for (let i = 0; i < strArr.length; i++) {
      if(strArr[i]) {
        // пишем лишнее в последний элемент разбивая с помощью splitter
        if (i > n - 1) {
          out[n - 1] = out[n - 1] + splitter + strArr[i]
        } else {
          out.push(strArr[i])
        }
      } else {
        out.push('')
      }
    }
    return out
  }

  static parse(xls: string[]) {
    const [surname, name, middleName] = this.splitByN(xls[1], 3);
    console.log(xls[10], xls[12]);
    //console.log(xls);

    const worker: Partial<IPersonnel> = {
      number: xls[0],
      surname,
      name,
      middleName,
      inn: invalidINN(xls[2]) ? null : xls[2],
      insurance: xls[3],
      /*passport*/
      educationName: xls[13],
      /*institutions*/
    };
    const passport: Partial<IPersonnel['passport']> = {
      birthDate: HandleData.ruDateToServer(xls[4]),
      birthPlace: xls[5],
      citizenship: xls[6],
      maritalStatus: xls[7],
      number: xls[8],
      passportIssued: xls[9],
      passportDate: HandleData.ruDateToServer(xls[10]),
      address: xls[11],
      passportRegDate: HandleData.ruDateToServer(xls[12]),
    };
    const institution: Partial<IPersonnel['institutions'][0]> = {
      name: xls[14],

      endDate: HandleData.setYear(xls[16]),
      qualification: xls[17],
      specialty: xls[18],
      docNumber: xls[19],// T
    };


    return {
      worker, passport, institution
    }
  }

}



