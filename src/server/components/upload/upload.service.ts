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
import LaborContract from '../personnel/relations/personnel-labor-contract.interface';
import {IPassport} from '../personnel/relations/personnel-passport.interface';
import IInstitution from '../personnel/relations/personnel-institution.interface';
import IScientificInst from '../personnel/relations/personnel-scientific-inst.interface';
import IWorkExp from '../personnel/relations/personnel-work-exp.interface';
import ILaborContract from '../personnel/relations/personnel-labor-contract.model';
import * as fs from "fs";
import * as fsExt from "fs-extend";
import LaborContractDocx from "../print/labor-contract-docx.model";
import {dirWorkHistory} from "../../../shared/constants";
import * as path from "path";

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
    {worker, passport, institution, scientificInst , workplaces, workExp, laborContracts}: {
      worker: Partial<IPersonnel>,
      passport: Partial<IPassport>,
      institution: Partial<IInstitution>,
      scientificInst: Partial<IScientificInst>,
      workplaces: Partial<IWorkExp>,
      workExp: Partial<IWorkExp[]>,
      laborContracts: Partial<ILaborContract>
    }) {
    // ищу если есть такой
    const oldWorker = await Personnel.findOne({where: {
      surname: worker.surname,
      name: worker.name,
      middleName: worker.middleName,
      }});
    if (oldWorker) {
      await oldWorker.update(worker);
      return this.upsert({worker: oldWorker, passport, institution, scientificInst , workplaces, workExp, laborContracts})
    } else {
      return this.createDBPersonnelByXls({worker, passport, institution, scientificInst , workplaces, workExp, laborContracts})
    }
  }

  async createDBPersonnelByXls({worker, passport, institution, scientificInst , workplaces, workExp, laborContracts}) {
    // создаю юзера потом подсовываю ему связанные данные
    const newWorker = await this.personnelService.createOne(worker);
    return this.upsert({worker: newWorker, passport, institution, scientificInst , workplaces, workExp, laborContracts})
  }
  async createMassDBPersonnelByXls(table: any[]) {
    return table.forEach((row, i) =>
      setTimeout(() => this.createDBPersonnelByXls(row), i * 200))
  }

  upsert({worker, passport, institution, scientificInst , workplaces, workExp, laborContracts}) {
    const pId = worker.id;
    passport.personnelId = pId;
    institution.personnelId = pId;
    scientificInst.personnelId = pId;
    workplaces.personnelId = pId;

    laborContracts.personnelId = pId;
    return Promise.all([
      Passport.upsert(passport),
      Institution.upsert(institution),
      ScientificInst.upsert(scientificInst),
      Workplace.upsert(workplaces),
      LaborContract.upsert(laborContracts),
    ].concat(
      workExp.map(workExpRow => {
        workExpRow.personnelId = pId;
        return WorkExp.upsert(workExpRow)
      })
    )).then(() => worker);
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
