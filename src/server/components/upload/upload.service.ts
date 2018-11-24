import {Injectable} from "@nestjs/common";
import {IFileUpload} from "../../../shared/interfaces/file-upload";
import {ErrHandler} from "../../services/error-handler.service";
import {PersonnelService} from "../personnel/personnel.service";
import Personnel from "../personnel/personnel.model";
import {IBuildedFromXlsWorker, ParsePersonnelXls} from './parse-personnel-xls.class';
import Passport from '../personnel/relations/personnel-passport.model';
import Institution from '../personnel/relations/personnel-institution.model';
import ScientificInst from '../personnel/relations/personnel-scientific-inst.model';
import Workplace from '../personnel/relations/personnel-workplace.model';
import WorkExp from '../personnel/relations/personnel-work-exp.model';
import * as fs from "fs-extra";
import LaborContractDocx from "../print/labor-contract-docx.model";
import {dirWorkHistory} from "../../../shared/constants";
import * as path from "path";
import {HandleData} from "../../../shared/handle-data";
import AcademicRank from "../personnel/relations/academic-rank.model";
import Reward from "../personnel/relations/personnel-reward.model";
import {IParsedQualification, ParseXls} from './parse-diffs-xls.class';
import QualImprovement from '../personnel/relations/personnel-qual-improvement.model';
import {staffJsDB} from "../../configs/staffjs.database";

export const dirLaborContractDocx = 'files/labor-contracts/';

@Injectable()
export class UploadService {
  constructor(private errHandler: ErrHandler,
              private personnelService: PersonnelService) {

  }

  createWorkersFromXls(mass: boolean) {
    return mass
      ? this.createAllWorkersFromXls(ParsePersonnelXls.createMass())
      : this.createOneWorkerFromXls(ParsePersonnelXls.create());
  }

  /* _createWorkersFromXls(update: boolean) {
   return update
      ? this.updateDBPersonnelByXls(ParsePersonnelXls.create())
      : this.createOneWorkerFromXls(ParsePersonnelXls.create());
  }

  async updateDBPersonnelByXls(buildedWorker: IBuildedFromXlsWorker) {
    // ищу если есть такой
    const oldWorker = await this.personnelService.findByFIO([
      buildedWorker.worker.surname, buildedWorker.worker.name, buildedWorker.worker.middleName,
    ]);
    if (oldWorker) {
      await oldWorker.update(buildedWorker.worker);
      buildedWorker.worker = oldWorker;
      return this.createRelsForNewWorker(buildedWorker, null)
    } else {
      return this.createOneWorkerFromXls(buildedWorker)
    }
  }*/

  createOneWorkerFromXls(buildedWorker) {
    return staffJsDB.transaction((transaction) => this._createOneWorkerFromXls(buildedWorker, transaction));
  }

  _createOneWorkerFromXls(buildedWorker, transaction) {
    return Personnel.create(buildedWorker.worker, {transaction}).then(newWorker => {
      buildedWorker.worker = newWorker;
      return this.createRelsForNewWorker(buildedWorker, transaction)
    })

  }
  async createAllWorkersFromXls(table: any[]) {
    return staffJsDB.transaction((transaction) => Promise.all(
      table.map((row) => this._createOneWorkerFromXls(row, transaction))
    ))
  }

  createRelsForNewWorker({worker, passport, institution, scientificInst , workplace, workExp, academicRank, rewards}: IBuildedFromXlsWorker, transaction) {
    const pId = worker.id;
    passport.personnelId = pId;
    let promises = [Passport.upsert(passport, {transaction})];
    // наполняю таблицу только если есть хоть одно значение в связанной сущности
    if (!HandleData.onlyEmptyKeys(institution)) {
      institution.personnelId = pId;
      promises.push(Institution.upsert(institution, {transaction}))
    }
    if (!HandleData.onlyEmptyKeys(scientificInst)) {
      scientificInst.personnelId = pId;
      promises.push(ScientificInst.upsert(scientificInst, {transaction}))
    }
    if (!HandleData.onlyEmptyKeys(workplace)) {
      workplace.personnelId = pId;
      promises.push(Workplace.upsert(workplace, {transaction}))
    }
    if (!HandleData.onlyEmptyKeys(academicRank)) {
      academicRank.personnelId = pId;
      promises.push(AcademicRank.upsert(academicRank, {transaction}))
    }
    if (rewards) {
      promises = promises.concat(
        rewards.map(rew => {
          rew.personnelId = pId;
          return Reward.upsert(rew, {transaction})
        })
      );
    }
    promises = promises.concat(
      workExp.map(workExpRow => {
        workExpRow.personnelId = pId;
        return WorkExp.upsert(workExpRow, {transaction})
      })
    );
    return Promise.all(promises).then(() =>
      ({worker, passport, institution, scientificInst , workplace, workExp, academicRank, rewards}));
  }

  async uploadLaborContractDocx(file: IFileUpload, type) {
    fs.ensureDirSync(dirLaborContractDocx);
    // todo удалять старый если не совпадает имя с новым
    const newUrl = `${type}-${file.originalname}`;
    try {
      fs.writeFileSync(dirLaborContractDocx + newUrl, file.buffer)
    } catch (e) {
      ErrHandler.throw('Что-то сломалось при записи файла')
    }
    const row = await LaborContractDocx.findOne({where: {type}});
    return row.update({'url': newUrl});
  }

  async uploadWorkHistoryFile(file: IFileUpload, workerId) {
    fs.ensureDirSync(dirWorkHistory);

    const newUrl = workerId + path.parse(file.originalname).ext;
    try {
      fs.writeFileSync(dirWorkHistory + newUrl, file.buffer)
    } catch (e) {
      ErrHandler.throw('Что-то сломалось. Попробуйте ещё раз')
    }
    const worker = await Personnel.findById(workerId);
    await worker.update({'workHistoryFileUrl': newUrl});
    return newUrl
  }

  uploadQualification() {
    const qual: IParsedQualification[] = ParseXls.parseQualification();
    // после резолва будет автокомкомит. так же обещают и авторобек если упадет. хотя в доках нет автоматики
    return staffJsDB.transaction((transaction) =>
      Promise.all(
        qual.map(row =>
          this.personnelService.findByFIO([row.surname, row.name, row.middleName])
            .then(worker =>
              worker
                ? QualImprovement.bulkCreate(row.rows.map(r => {
                  r.personnelId = worker.id;
                  return r
                }), {transaction})
                : Promise.resolve(null)
            )
        )
      )
    )

  }

}
