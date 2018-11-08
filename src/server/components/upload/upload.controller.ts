import {Controller, Post, Req, Headers, Body, FileInterceptor, UseInterceptors, UploadedFile} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {ErrHandlerService} from "../../services/error-handler.service";

@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService, private errHandler: ErrHandlerService) {

  }

  @Post('personnel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPersonnel(@Headers() headers, @UploadedFile() file)/*:PromiseLike<IFileUpload>*/ {
    return this.uploadService.readExcelFile(file)
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }

  @Post('fill-db-by-xls')
  async fillDBPersonnelByXls() {
    return
    /*.catch((e) => this.errHandler.sentToFront(e))*/
  }

  @Post('fill-db-by-local-xls')
  async fillDBPersonnelByLocalXls(@Body() body: {refill: boolean}) {
    return this.uploadService.fillDBPersonnelByLocalXls(body.refill)
  }

  @Post('update-db-by-xls')
  async updateDBPersonnel() {
    return
      /*.catch((e) => this.errHandler.sentToFront(e))*/
  }



}
