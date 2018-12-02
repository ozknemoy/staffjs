import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {DictService} from "./dict.service";
import SalaryDict from "./salary-dict.model";
import {AuthGuard} from '@nestjs/passport';
import {ISalaryDict} from './salary-dict.interface';
import {ErrHandler} from "../../services/error-handler.service";


@Controller('dict')
export class DictController {

  constructor(private dictService: DictService,
              private errHandler: ErrHandler) {}

  @Get('salary')
  getSalary() {
    return this.dictService.getSalary()
  }

  @Put('salary')
  @UseGuards(AuthGuard())
  async saveSalary(@Body() body: ISalaryDict) {
    /*return (body.id
        ? SalaryDict.findById(body.id).then(u => u.update(body))
        : SalaryDict.create(body)
    )*/
    return SalaryDict.upsert(body, { returning: true})
      .spread((s, created) => s)
      .catch(err => this.errHandler.handlaAll(err))
  }

  @Delete('salary/:id')
  @UseGuards(AuthGuard())
  async deleteSalary(@Param('id') id: string) {
    return SalaryDict.destroy({where: {id}})
  }


}
