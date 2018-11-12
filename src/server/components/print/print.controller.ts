import {Body, Controller, Get, Param, Post, Query, Res, UseGuards} from '@nestjs/common';
import {PrintService} from "./print.service";
import LaborContractDocx from "./labor-contract-docx.model";
import {AuthGuard} from "@nestjs/passport";
import * as fs from "fs";


@UseGuards(AuthGuard())
@Controller('print')
export class PrintController {
  constructor(private printService: PrintService) {

  }

  @Post('t2')
  printT2(@Query('userId') userId: string, @Res() resp) {
    //return this.printService.saveLocalForDevelopmentPdf()
    return this.printService.printT2(userId).then(data => {
      resp.contentType('application/pdf;charset=utf-8');
      resp.setHeader('content-disposition', `attachment; filename=${userId}-t2.pdf`);
      return resp.send(data);
    })
  }

  @Post('labor-contract-scientific/:userId')
  async printLaborContract(@Param('userId') userId: number, @Res() resp) {
    resp.contentType('application/vnd.openxmlformats-officedocument.wordprocessingml.document;charset=Windows-1251');
    resp.setHeader('content-disposition', `attachment; filename=${userId}-t2.docx`);
    const buffer = await this.printService.printLaborContractScientific(userId);
    return resp.send(buffer);
  }

  @Get('labor-contract/all')
  getLaborContractDocxAll() {
    return LaborContractDocx.findAll()
  }


}
