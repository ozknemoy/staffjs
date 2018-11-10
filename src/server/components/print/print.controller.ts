import {Body, Controller, Get, Param, Post, Query, Res, UseGuards} from '@nestjs/common';
import {PrintService} from "./print.service";
import LaborContractDocx from "./labor-contract-docx.model";
import {AuthGuard} from "@nestjs/passport";


@UseGuards(AuthGuard())
@Controller('print')
export class PrintController {
  constructor(private printService: PrintService) {

  }

  @Post('t2')
  printT2(@Query('userId') userId: string, @Res() resp) {
    return this.printService.saveLocalForDevelopmentPdf()
    /*return this.printService.printT2(userId).then(data => {
      resp.contentType('application/pdf; charset=utf-8');
      resp.setHeader('content-disposition', 'attachment; filename=somename.pdf');
      return resp.send(data);
    })*/
  }

  @Post('labor-contract-scientific/:userId')
  printLaborContract(@Param('userId') userId: number, @Res() resp) {
    this.printService.printLaborContractScientific(userId);
    return resp.send({ok: true});
  }

  @Get('labor-contract/all')
  getLaborContractDocxAll() {
    return LaborContractDocx.findAll()
  }


}
