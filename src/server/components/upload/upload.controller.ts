import {
  Controller, Post, Body, FileInterceptor, UseInterceptors, UploadedFile,
  UseGuards, Query, HttpStatus, HttpException
} from '@nestjs/common';
import {UploadService} from "./upload.service";
import {AuthGuard} from "@nestjs/passport";
import {IFileUpload} from "../../../shared/interfaces/file-upload";

@UseGuards(AuthGuard())
@Controller('upload')
export class UploadController {

  constructor(private uploadService: UploadService) {

  }

  @Post('fill-db-by-local-xls')
  async createWorkersFromXls(@Body() body: {mass: boolean}) {
    return this.uploadService.createWorkersFromXls(body.mass)
      //.catch(err => this.errHandler.handlaAll(err))
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

  @Post('qualification-up')
  uploadQualification() {
    return this.uploadService.uploadQualification()
  }


}
