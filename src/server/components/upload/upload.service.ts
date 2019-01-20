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
import {FakePersonnel} from '../../../shared/faker/fake-personnel';
import {deprecate, time} from 'core-decorators';

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

  private createdFakesIterations = 0;
  createFakerWorkerscreatedFakesIterations(amount: number, iterations = 500) {
    return this.createFakerWorkers(amount).then(() => {
      this.createdFakesIterations ++;
      return this.createdFakesIterations >= iterations
        ? Promise.resolve() : this.createFakerWorkerscreatedFakesIterations(amount)
    })
  }
  createFakerWorkers(amount: number) {
    return this.createAllWorkersFromXls(FakePersonnel.create(amount))
  }

  createOneWorkerFromXls(buildedWorker) {
    return staffJsDB.transaction((transaction) => this.createOneWorker(buildedWorker, transaction));
  }

  createOneWorker(_worker: IBuildedFromXlsWorker, transaction) {
    const {worker, include} = this.createOneWorkerWithRels(_worker);
    return Personnel.create(worker, {transaction, raw:true, include})
  }

  createOneWorkerWithRels({worker, passport, institution, scientificInst , workplace, workExp, academicRank, rewards}: IBuildedFromXlsWorker) {
    let include: any[] = [Passport];
    worker.passport = passport;
    if (!HandleData.onlyEmptyKeys(workplace)) {
      include.push(Workplace);
      worker.workplaces = [workplace]
    }
    if (!HandleData.onlyEmptyKeys(institution)) {
      include.push(Institution);
      worker.institutions = [institution]
    }
    if (!HandleData.onlyEmptyKeys(scientificInst)) {
      include.push(ScientificInst);
      worker.scientificInst = [scientificInst]
    }
    if (!HandleData.onlyEmptyKeys(academicRank)) {
      include.push(AcademicRank);
      worker.academicRank = [academicRank]
    }
    if (rewards) {
      include.push(Reward);
      worker.rewards = rewards
    }
    include.push(WorkExp);
    worker.workExp = workExp;

    return {worker, include}
  }

  //@time('createAllFakeWorkers')
  createAllFakeWorkers(tablez: any[]) {
    let include;
    const workers = tablez.map((worker, i) => {
      // include у всех одинаковы
      if(i === 0) {
        include = worker.include
      }
      return this.createOneWorkerWithRels(worker).worker
    });
    Personnel.bulkCreate(workers, /*{include}*/)

  }


  createAllWorkersFromXls(table: any[]) {
    return staffJsDB.transaction((transaction) => Promise.all(
      table.map((row) => this.createOneWorker(row, transaction))
    ))
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
    // после резолва будет автокоммит. так же обещают и авторолбек если упадет. хотя в доках нет автоматики
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
                : Promise.resolve(<any>[row.surname, row.name, row.middleName].join(' '))
            )
        )
      )
    )

  }

}
