
import * as fs from "fs";
import xlsx from 'node-xlsx';
import {IPersonnel} from '../personnel/personnel.interface';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import {invalidINN} from '../../../shared/validators';
import {HttpException} from "@nestjs/common";
import {ErrHandlerService} from "../../services/error-handler.service";
import {attractionTermsDict} from "../../../shared/dictionaries/attraction-terms.dict";

export class ParseXls {

  static createFromFile(file) {
    const w = xlsx.parse(file)[0];
    return  this.parse( w.data[1]);
  }

  static createMass(excelPath = './stafff.xls') {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      return  firstList.data.slice(1).map(row => this.parse(row));
    } catch (e) {
      ErrHandlerService.throw('Ошибка чтения/разбора файла', e);
    }
  }

  static create(excelPath = './stafff.xls') {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      return  this.parse(firstList.data[44]);
    } catch (e) {
      ErrHandlerService.throw('Ошибка чтения/разбора файла');
    }
  }

  static splitByN(_str, n, splitter = ' ') {
    const strArr = _str.split(splitter);
    let out = [];
    for (let i = 0; i < strArr.length; i++) {
      if (strArr[i]) {
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
    xls.forEach((cell, i) => {
      if (cell === '') {
        xls[i] = null
      }
    });
    const [surname, name, middleName] = this.splitByN(xls[1], 3);
    const sex = !HandleData.isInvalidPrimitive(middleName)
      ? middleName.trim().slice(-3) === 'вна'
        ? 'ж' : 'м'
      : null;
    const attractionTerms = HandleData.where(attractionTermsDict, 'shortName', xls[44], true).name;
    const worker: Partial<IPersonnel> = {
      number: xls[0],
      surname,
      name,
      middleName,
      sex,
      inn: invalidINN(xls[2]) ? null : xls[2],
      insurance: xls[3],
      educationName: xls[13],
      workType: attractionTerms
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
      docNumber: xls[19],
    };
    const scientificInst: Partial<IPersonnel['scientificInst'][0]> = {
      name: xls[21],
      fullInfo: xls[22],
      endDate: HandleData.setYear(xls[23]),
      specialty: xls[24],
    };
    // Z-AH пока пропустил
    const workplaces: Partial<IPersonnel['workplaces'][0]> = {
      date: HandleData.ruDateToServer(xls[42] || xls[56]),
      department: xls[34],
      specialty: xls[35],
      reason: xls[43] || xls[57],
      academicCouncilDate: HandleData.ruDateToServer(xls[120]),
      attractionTerms,
      rate: HandleData.parseNumber(xls[37]),
      duration: HandleData.parseNumber(xls[108]),
      category: xls[37],
      dismissalDate: HandleData.ruDateToServer(xls[74]),
      dismissalGround: xls[75],
      dismissalReason: xls[76],
      lawArticle: xls[77],
    };
    const workExp: Partial<IPersonnel['workExp']> = this.getWorkExp(xls, null);
    const laborContracts: Partial<IPersonnel['laborContract'][0]> = {
      number: xls[39],
      date: HandleData.ruDateToServer(xls[40]),
      endDate: HandleData.ruDateToServer(xls[41]),
      specialty: xls[35],
      department: xls[34],
      attractionTerms,
    };
    return {
      worker, passport, institution, scientificInst , workplaces, workExp, laborContracts
    }
  }

  static getWorkExp(xls, personnelId): Partial<IPersonnel['workExp']> {
    return <Partial<IPersonnel['workExp']>>[{
      id: null,
      personnelId,
      typeId: 1,
      amountY: HandleData.parseNumber(xls[46]),
      amountM: HandleData.parseNumber(xls[47]),
      amountD: HandleData.parseNumber(xls[48]),
    }, {
      id: null,
      personnelId,
      typeId: 2,
      amountY: HandleData.parseNumber(xls[49]),
      amountM: HandleData.parseNumber(xls[50]),
      amountD: HandleData.parseNumber(xls[51]),
    }, {
      id: null,
      personnelId,
      typeId: 3,
      amountY: null,
      amountM: null,
      amountD: null,
    }]
  }
}



