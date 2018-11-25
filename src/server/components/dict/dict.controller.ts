import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
import {DictService} from "./dict.service";
import SalaryDict from "./salary-dict.model";
import SalaryGroupDict from "./salary-group-dict.model";


@Controller('dict')
export class DictController {

  constructor(private dictService: DictService) {}

  @Get('salary')
  //@UseGuards(AuthGuard())
  getSalary() {
    return SalaryDict.findAll()
  }
  @Get('salary-dict')
  //@UseGuards(AuthGuard())
  getSalaryGroup() {
    return SalaryGroupDict.findAll({include: [SalaryDict]})
  }


}
