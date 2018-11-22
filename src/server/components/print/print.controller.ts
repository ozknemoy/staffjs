import {Body, Controller, Get, Param, Post, Query, Res, UseGuards} from '@nestjs/common';
import {PrintService} from "./print.service";
import LaborContractDocx from "./labor-contract-docx.model";
import {AuthGuard} from "@nestjs/passport";
import * as fs from "fs";
import {IServerFilter} from '../../../shared/interfaces/server-filter.interface';


@UseGuards(AuthGuard())
@Controller('print')
export class PrintController {
  private msTypePrefix = 'application/vnd.openxmlformats-officedocument.';
  constructor(private printService: PrintService) {

  }

  @Post('t2')
  printT2(@Query('userId') userId: string, @Res() resp) {
    return this.printService.printT2(userId).then(data => {
      resp.contentType('application/pdf;charset=utf-8');
      resp.setHeader('content-disposition', `attachment; filename=${userId}-t2.pdf`);
      return resp.send(data);
    })
  }

  @Post('labor-contract/:userId')
  async prntLaborContract(@Param('userId') userId: number, @Res() resp, @Query('type') type: string) {
    resp.contentType(this.msTypePrefix + 'wordprocessingml.document;charset=Windows-1251');
    resp.setHeader('content-disposition', `attachment; filename=${userId}-t2.docx`);
    const buffer = await this.printService.printLaborContract(userId, type, false);
    return resp.send(buffer);
  }

  @Get('labor-contract/all')
  getLaborContractDocxAll() {
    return LaborContractDocx.findAll({order: [['id', 'ASC']]})
  }

  @Post('filter-and-xls')
  async filterAndXls(@Res() resp, @Body() filter: IServerFilter) {
    resp.contentType(this.msTypePrefix + 'spreadsheetml.sheet;charset=Windows-1251');
    resp.setHeader('content-disposition', `attachment; filename=filtered-list.xlsx`);
    const buffer = await this.printService.filterAndXls(filter);
    return resp.send(buffer);
  }


}
