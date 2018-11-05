import {Component} from "@nestjs/common";
import {MULTER_DIR} from "../../configs/multer.middleware";
import {IFileUpload} from "../../interfaces/file-upload";
import {ErrHandlerService} from "../../services/error-handler.service";
import * as fs from "fs";
import xlsx from 'node-xlsx';
import {INodeXlsxParsed} from "../../interfaces/node-xlsx";
import {IPersonnel, IPersonnelAdapter} from "../personnel/personnel.interface";
import {PersonnelService} from "../personnel/personnel.service";
import Personnel from "../personnel/personnel.model";
import {ParseXls} from './parse-xls.class';
import {IPassport} from '../personnel/relations/personnel-passport.interface';
import Passport from '../personnel/relations/personnel-passport.model';
import Institution from '../personnel/relations/personnel-institution.model';

@Component()
export class UploadService {

  constructor(private errHandler: ErrHandlerService, private personnelService: PersonnelService) {

  }

  readExcelFile(file: IFileUpload) {
    // по полю fieldname определяю что за файл сохранять
    const excelPath = MULTER_DIR + file.filename;
    const staff: INodeXlsxParsed = xlsx.parse(fs.readFileSync(excelPath));
    fs.unlink(excelPath);
    return Promise.all(
      staff[0].data.map(st => Personnel.create(new IPersonnelAdapter(st)))
    ).then(d => {
      return this.personnelService.getAll()
    });
  }


  /*uploadDoc(headers, files) {


      return this.usersService.doByAuthKey(headers, (user_id) => {
          return UserDocumentImage.findOne({
              where: {user_id}
          }).then(img =>
              img ? img.update({image})
                  : UserDocumentImage.create({user_id, type, image})
          ).catch((e) => this.errHandler.sentToFront(e))
      })
  }*/

  async fillDBPersonnelByLocalXls(update: boolean) {
    return update
      ? this.updateDBPersonnelByXls(ParseXls.create())
      : this.createDBPersonnelByXls(ParseXls.create());
  }

  async updateDBPersonnelByXls({worker, passport, institution}) {
    console.log(worker, passport, institution);
    // ищу если есть такой
    const oldWorker = await Personnel.findOne({where: {
      surname: worker.surname,
      name: worker.name,
      middleName: worker.middleName,
      }});
    if (oldWorker) {
      console.log('-------- update ----------');
      await oldWorker.update(worker);
      return this.upsert({worker: oldWorker, passport, institution})
    } else {
      return this.createDBPersonnelByXls({worker, passport, institution})
    }
  }

  async createDBPersonnelByXls({worker, passport, institution}) {
    // создаю юзера потом подсовываю ему связанные данные
    const newWorker = await this.personnelService.createOne(worker);
    return this.upsert({worker: newWorker, passport, institution})
  }

  upsert({worker, passport, institution}) {
    const pId = worker.id;
    passport.personnelId = pId;
    institution.personnelId = pId;
    return Promise.all([
      Passport.upsert(passport),
      Institution.upsert(institution),
    ]).then(() => worker);
  }
}



