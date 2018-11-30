import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {DictService} from "./dict.service";
import SalaryDict from "./salary-dict.model";
import SalaryGroupDict from "./salary-group-dict.model";
import {AuthGuard} from '@nestjs/passport';
import {ISalaryDict} from './salary-dict.interface';


@Controller('dict')
export class DictController {

  constructor(private dictService: DictService) {}

  @Get('salary')
  getSalary() {
    return SalaryDict.findAll({order: [['id', 'ASC']]})
  }

  @Put('salary/:id')
  @UseGuards(AuthGuard())
  async saveSalary(@Body() body: ISalaryDict, @Param('id') id: string) {
    const row = await SalaryDict.findById(id);
    return row.update(body)
  }


}
