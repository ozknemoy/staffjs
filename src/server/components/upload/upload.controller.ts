import {
  Controller, Post, Body, FileInterceptor, UseInterceptors, UploadedFile,
  UseGuards, Get, Query
} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {ErrHandler} from "../../services/error-handler.service";
import {AuthGuard} from "@nestjs/passport";
import {IFileUpload} from "../../../shared/interfaces/file-upload";

@UseGuards(AuthGuard())
@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService) {

  }

  @Post('fill-db-by-xls')
  async fillDBPersonnelByXls() {
    return
  }

  @Post('fill-db-by-local-xls')
  async fillDBPersonnelByLocalXls(@Body() body: {mass: boolean}) {
    return this.uploadService.fillDBPersonnelByLocalXls(body.mass)
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

  @Post('work-history')
  @UseInterceptors(FileInterceptor('file'))
  uploadWorkHistoryFile(@UploadedFile() file: IFileUpload, @Query('workerId') workerId: number) {
    return this.uploadService.uploadWorkHistoryFile(file, workerId)
  }


}
