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

  async fillDBPersonnelByLocalXls() {
    // создаю юзера потом подсовываю ему данные
    const {worker, passport, institution} = ParseXls.create();
    console.log(worker, passport, institution);

    const newWorker = await this.personnelService.createOne(worker);
    const pId = newWorker.id;
    passport.personnelId = pId;
    institution.personnelId = pId;
    /*return Promise.all([
      Passport.create(passport),
      Institution.create(institution),
    ]).then(() => newWorker);*/
  }
}



