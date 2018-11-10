import {
  Controller, Post, Req, Headers, Body, FileInterceptor, UseInterceptors, UploadedFile,
  UseGuards, Get, Query
} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {ErrHandlerService} from "../../services/error-handler.service";
import {AuthGuard} from "@nestjs/passport";
import LaborContractDocx from "../print/labor-contract-docx.model";
import {IFileUpload} from "../../interfaces/file-upload";

@UseGuards(AuthGuard())
@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService, private errHandler: ErrHandlerService) {

  }

  @Post('personnel')
  @UseInterceptors(FileInterceptor('file'))
  async uploadPersonnel(@Headers() headers, @UploadedFile() file)/*:PromiseLike<IFileUpload>*/ {
    return this.uploadService.readExcelFile(file)
  }

  @Post('fill-db-by-xls')
  async fillDBPersonnelByXls() {
    return
  }

  @Post('fill-db-by-local-xls')
  async fillDBPersonnelByLocalXls(@Body() body: {refill: boolean}) {
    return this.uploadService.fillDBPersonnelByLocalXls(body.refill)
  }

  @Post('update-db-by-xls')
  async updateDBPersonnel() {
    return
  }

  @Post('labor-contract')
  @UseInterceptors(FileInterceptor('file'))
  uploadLaborContractDocx(@UploadedFile() file: IFileUpload, @Query('type') typeId: number) {
    return this.uploadService.uploadLaborContractDocx(file, typeId)
  }


}
