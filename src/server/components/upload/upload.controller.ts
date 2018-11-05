import {Controller, Post, Req, Headers, Body} from "@nestjs/common";
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
  async fillDBPersonnelByLocalXls(@Body() body: {refill: boolean}) {
    return this.uploadService.fillDBPersonnelByLocalXls(body.refill)
  }

  @Post('update-db-by-xls')
  async updateDBPersonnel(@Headers() headers, @Req() {files})/*:PromiseLike<IFileUpload>*/ {

    return this.uploadService.readExcelFile(files[0])
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }



}
