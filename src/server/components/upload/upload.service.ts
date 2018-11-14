import {Injectable} from "@nestjs/common";
import {IFileUpload} from "../../interfaces/file-upload";
import {ErrHandlerService} from "../../services/error-handler.service";
import {IPersonnel} from '../personnel/personnel.interface';
import {PersonnelService} from "../personnel/personnel.service";
import Personnel from "../personnel/personnel.model";
import {ParseXls} from './parse-xls.class';
import Passport from '../personnel/relations/personnel-passport.model';
import Institution from '../personnel/relations/personnel-institution.model';
import ScientificInst from '../personnel/relations/personnel-scientific-inst.model';
import Workplace from '../personnel/relations/personnel-workplace.model';
import WorkExp from '../personnel/relations/personnel-work-exp.model';
import LaborContract from '../personnel/relations/personnel-labor-contract.model';
import {IPassport} from '../personnel/relations/personnel-passport.interface';
import IInstitution from '../personnel/relations/personnel-institution.interface';
import IScientificInst from '../personnel/relations/personnel-scientific-inst.interface';
import IWorkExp from '../personnel/relations/personnel-work-exp.interface';
import ILaborContract from '../personnel/relations/personnel-labor-contract.interface';
import * as fs from "fs";
import * as fsExt from "fs-extend";
import LaborContractDocx from "../print/labor-contract-docx.model";
import {dirWorkHistory} from "../../../shared/constants";
import * as path from "path";
import {HandleData} from "../../../client/app/shared/services/handle-data";
import {IPersonnelNamedThingWithDoc} from "../personnel/relations/personnel-named-thing-with-doc.interface";
import IAcademicRank from "../personnel/relations/academic-rank.interface";
import AcademicRank from "../personnel/relations/academic-rank.model";
import Reward from "../personnel/relations/personnel-reward.model";

export const dirLaborContractDocx = 'files/labor-contracts/';

@Injectable()
export class UploadService {
  constructor(private errHandler: ErrHandlerService,
              private personnelService: PersonnelService) {

  }

  async fillDBPersonnelByLocalXls(mass: boolean) {
    return mass
      ? this.createMassDBPersonnelByXls(ParseXls.createMass())
      : this.createDBPersonnelByXls(ParseXls.create());
  }

  async _fillDBPersonnelByLocalXls(update: boolean) {
    return update
      ? this.updateDBPersonnelByXls(ParseXls.create())
      : this.createDBPersonnelByXls(ParseXls.create());
  }

  async updateDBPersonnelByXls(
    {worker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards}: {
      worker: Partial<IPersonnel>,
      passport: Partial<IPassport>,
      institution: Partial<IInstitution>,
      scientificInst: Partial<IScientificInst>,
      workplace: Partial<IWorkExp>,
      workExp: Partial<IWorkExp[]>,
      laborContract: Partial<ILaborContract>,
      academicRank: Partial<IAcademicRank>,
      rewards: Partial<IPersonnelNamedThingWithDoc[]>,
    }) {
    // ищу если есть такой
    const oldWorker = await Personnel.findOne({where: {
      surname: worker.surname,
      name: worker.name,
      middleName: worker.middleName,
      }});
    if (oldWorker) {
      await oldWorker.update(worker);
      return this.upsert({worker: oldWorker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards})
    } else {
      return this.createDBPersonnelByXls({worker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards})
    }
  }

  async createDBPersonnelByXls({worker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards}) {
    // создаю юзера потом подсовываю ему связанные данные
    const newWorker = await this.personnelService.createOne(worker);
    return this.upsert({worker: newWorker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards})
  }
  async createMassDBPersonnelByXls(table: any[]) {
    return table.forEach((row, i) =>
      setTimeout(() => this.createDBPersonnelByXls(row), i * 200))
  }

  upsert({worker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards}) {
    const pId = worker.id;
    passport.personnelId = pId;
    let promises = [Passport.upsert(passport)];
    // наполняю таблицу только если есть хоть одно значение в связанной сущности
    if(!HandleData.onlyEmptyKeys(institution)) {
      institution.personnelId = pId;
      promises.push(Institution.upsert(institution))
    }
    if(!HandleData.onlyEmptyKeys(scientificInst)) {
      scientificInst.personnelId = pId;
      promises.push(ScientificInst.upsert(scientificInst))
    }
    if(!HandleData.onlyEmptyKeys(workplace)) {
      workplace.personnelId = pId;
      promises.push(Workplace.upsert(workplace))
    }
    if(!HandleData.onlyEmptyKeys(laborContract)) {
      laborContract.personnelId = pId;
      promises.push(LaborContract.upsert(laborContract))
    }
    if(!HandleData.onlyEmptyKeys(academicRank)) {
      academicRank.personnelId = pId;
      promises.push(AcademicRank.upsert(academicRank))
    }
    if(rewards) {
      promises = promises.concat(
        rewards.map(rew => {
          rew.personnelId = pId;
          return Reward.upsert(rew)
        })
      );
    }
    promises = promises.concat(
      workExp.map(workExpRow => {
        workExpRow.personnelId = pId;
        return WorkExp.upsert(workExpRow)
      })
    );
    return Promise.all(promises).then(() => ({worker, passport, institution, scientificInst , workplace, workExp, laborContract, academicRank, rewards}));
  }

  async uploadLaborContractDocx(file: IFileUpload, type) {
    if(!fs.existsSync(dirLaborContractDocx)) {
      fs.mkdirSync(dirLaborContractDocx)
    }
    // todo удалять старый если не совпадает имя с новым
    const newUrl = `${type}-${file.originalname}`;
    try {
      fs.writeFileSync(dirLaborContractDocx + newUrl, file.buffer)
    } catch(e) {
      ErrHandlerService.throw('Что-то сломалось. Попробуйте ещё раз')
    }
    const row = await LaborContractDocx.findOne({where: {type}});
    return row.update({'url': newUrl});
  }

  async uploadWorkHistoryFile(file: IFileUpload, workerId) {
    if(!fs.existsSync(dirWorkHistory)) {
      fsExt.mkdirSync(dirWorkHistory)
    }
    const newUrl = workerId + path.parse(file.originalname).ext;
    try {
      fs.writeFileSync(dirWorkHistory + newUrl, file.buffer)
    } catch(e) {
      ErrHandlerService.throw('Что-то сломалось. Попробуйте ещё раз')
    }
    const worker = await Personnel.findById(workerId);
    await worker.update({'workHistoryFileUrl': newUrl});
    return newUrl
  }
}
