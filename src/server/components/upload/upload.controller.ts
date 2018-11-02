import {Controller, Post, Req, Headers} from "@nestjs/common";
import {UploadService} from "./upload.service";
import {ErrHandlerService} from "../../services/error-handler.service";

@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService, private errHandler: ErrHandlerService) {

  }

  @Post('personnel')
  async uploadPersonnel(@Headers() headers, @Req() {files})/*:PromiseLike<IFileUpload>*/ {

    return this.uploadService.readExcelFile(files[0])
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }

  @Post('fill-db-by-xls')
  async fillDBPersonnel(@Headers() headers, @Req() {files})/*:PromiseLike<IFileUpload>*/ {

    return this.uploadService.readExcelFile(files[0])
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }

  @Post('fill-db-by-local-xls')
  async fillDBPersonnelByLocalXls(@Headers() headers)/*:PromiseLike<IFileUpload>*/ {
    return this.uploadService.fillDBPersonnelByLocalXls()
      .catch((e) => this.errHandler.sentToFront(e))
  }

  @Post('update-db-by-xls')
  async updateDBPersonnel(@Headers() headers, @Req() {files})/*:PromiseLike<IFileUpload>*/ {

    return this.uploadService.readExcelFile(files[0])
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }



}
