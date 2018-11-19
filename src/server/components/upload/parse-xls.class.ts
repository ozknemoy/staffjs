
import * as fs from "fs";
import xlsx from 'node-xlsx';
import {IPersonnel} from '../personnel/personnel.interface';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import {invalidINN} from '../../../shared/validators';
import {ErrHandler} from "../../services/error-handler.service";
import {attractionTermsDict} from "../../../shared/dictionaries/attraction-terms.dict";
import {IPersonnelNamedThingWithDoc} from "../personnel/relations/personnel-named-thing-with-doc.interface";
import IWorkExp from "../personnel/relations/personnel-work-exp.interface";
import IScientificInst from '../personnel/relations/personnel-scientific-inst.interface';
import {IPassport} from '../personnel/relations/personnel-passport.interface';
import IInstitution from '../personnel/relations/personnel-institution.interface';
import IAcademicRank from '../personnel/relations/academic-rank.interface';

export interface IBuildedFromXlsWorker {
  worker: Partial<IPersonnel>,
  passport: Partial<IPassport>,
  institution: Partial<IInstitution>,
  scientificInst: Partial<IScientificInst>,
  workplace: Partial<IWorkExp>,
  workExp: Partial<IWorkExp[]>,
  academicRank: Partial<IAcademicRank>,
  rewards: Partial<IPersonnelNamedThingWithDoc[]>,
}

export class ParseXls {

  static createFromFile(file) {
    const w = xlsx.parse(file)[0];
    return  this.parse( w.data[1]);
  }

  static createMass(excelPath = './staff.xls'): IBuildedFromXlsWorker[] {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      return  firstList.data.slice(1).map(row => this.parse(row));
    } catch (e) {
      ErrHandler.throw('Ошибка чтения/разбора файла', e);
    }
  }

  static create(excelPath = './staff.xls') {
    try {
      const firstList = xlsx.parse(fs.readFileSync(excelPath))[0];
      return  this.parse(firstList.data[1]);
    } catch (e) {
      ErrHandler.catchPropagate('Ошибка чтения/разбора файла', e);
      //throw;
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
    try {
      this.splitByN(xls[1], 3)
    } catch (e) {
      ErrHandler.propogate('Ошибка разбора файла. Строка содержит пустую ячейку с ФИО. Вероятно excel содержит пустые строки', e);
    }
    const [surname, name, middleName] = this.splitByN(xls[1], 3);
    const sex = !HandleData.isInvalidPrimitive(middleName)
      ? middleName.trim().slice(-3) === 'вна'
        ? 'ж' : 'м'
      : null;
    const attractionTerms = HandleData.where(attractionTermsDict, 'shortName', xls[44], true).name;
    const worker: Partial<IPersonnel> = {
      // пропускаю только 4 значные
      number: xls[83] && (parseInt(xls[83]) > 999) ? xls[83] : null,
      surname,
      name,
      middleName,
      sex,
      inn: invalidINN(xls[2]) ? null : xls[2],
      insurance: xls[3],
      educationName: xls[13],
      workType: attractionTerms,
      workExpDate: xls[56],
      profession: xls[54],
      contractNumber: xls[39],
      membershipGAN: !!xls[58],
      membershipGANDate: HandleData.ruDateToServer(xls[59]),
      membershipOAN: !!xls[60],
      membershipOANDate: HandleData.ruDateToServer(xls[61]),
      scientificRank: xls[25],
      phone: xls[85],
      medicalCert: !!xls[36],
      psychoCert: !!xls[118],
      convictionCert: !!xls[113],
      disabilityDegree: xls[107],
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
      academicDegree: xls[111],
      scienceBranch: xls[26],
      dateAndNumber: xls[29],
      dissertationCouncil: xls[28],
    };
    const academicRank: Partial<IPersonnel['academicRank'][0]> = {
      rank: xls[112],
      specialty: xls[33],
      docNumber: xls[30],
      docDate: HandleData.ruDateToServer(xls[31]),
      appointingAuthority: xls[32],
    };
    // Z-AH пока пропустил
    const workplace: Partial<IPersonnel['workplaces'][0]> = {
      date: HandleData.ruDateToServer(xls[42] || xls[56]),
      department: xls[34],
      specialty: xls[35],
      reason: xls[43] || xls[57],
      academicCouncilDate: HandleData.ruDateToServer(xls[120]),
      attractionTerms,
      rate: HandleData.parseNumber(xls[37]),
      duration: HandleData.parseNumber(xls[108]),
      category: xls[38],
      dismissalDate: HandleData.ruDateToServer(xls[74]),
      dismissalGround: xls[75],
      lawArticle: xls[77],
      active: true,
      contractNumber: xls[39],
    };
    const workExp: Partial<IWorkExp[]> = this.getWorkExp(xls, null);
    const rewards = <Partial<IPersonnelNamedThingWithDoc>>this.getRewards(xls);
    return {
      worker, passport, institution, scientificInst , workplace, workExp,
      academicRank, rewards
    }
  }

  static getRewards(xls) {
    const r = [];
    if (xls[62]) r.push('ОрденаМедали');
    if (xls[64]) r.push('ВедомствНагр');
    if (xls[65]) r.push('ПремииСПб');
    if (xls[66]) r.push('ЗвЗаслужИгоспремии');
    if (xls[67]) r.push('НагрГУАП');
    if (xls[68]) r.push('ПрочиеНагр');
    if (xls[71]) r.push('РегионНагр');
    if (xls[93]) r.push('ЗаслДеятН');
    if (xls[94]) r.push('ЗаслРабВШ');
    if (xls[95]) r.push('ЗаслРабСПО');
    if (xls[96]) r.push('ЗаслЮр');
    if (xls[97]) r.push('ПочРабВПО');
    if (xls[98]) r.push('РазвНИРстуд');
    if (xls[99]) r.push('ЗаслПрофГУАП');
    if (xls[100]) r.push('ПочРабСфМолП');
    if (xls[101]) r.push('ПочРабОбО');
    if (xls[110]) r.push('ПочРабНауки');

    return r.length ? r.map((name) => ({name})) : null
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



