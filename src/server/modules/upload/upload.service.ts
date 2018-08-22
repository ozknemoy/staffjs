import {Component} from "@nestjs/common";
import {MULTER_DIR} from "../../configs/multer.middleware";
import {IFileUpload} from "../../interfaces/file-upload";
import {ErrHandler} from "../../services/error-handler.service";
import * as fs from "fs";
import xlsx from 'node-xlsx';
import {INodeXlsxParsed} from "../../interfaces/node-xlsx";
import Staff, {IStaff} from "../staff/staff.interface";
import {StaffService} from "../staff/staff.service";

@Component()
export class UploadService {

  constructor(private errHandler: ErrHandler, private staffService: StaffService) {

  }

  readExcelFile(file: IFileUpload) {
    // по полю fieldname определяю что за файл сохранять
    const excelPath = MULTER_DIR + file.filename;
    const staff: INodeXlsxParsed = xlsx.parse(fs.readFileSync(excelPath));
    fs.unlink(excelPath);
    return Promise.all(
      staff[0].data.map(st => Staff.create(new IStaff(st)))
    ).then(d => {
      return this.staffService.getAllStaff()
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


}



