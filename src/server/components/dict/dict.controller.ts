import {Body, Controller, Delete, Get, Param, Post, Put, UseGuards} from '@nestjs/common';
import {DictService} from "./dict.service";
import SalaryDict from "./salary-dict.model";
import {AuthGuard} from '@nestjs/passport';
import {ISalaryDict} from './salary-dict.interface';
import {ErrHandler} from "../../services/error-handler.service";
import AcademicRank from "../personnel/relations/academic-rank.model";
import {IFacultyDict} from "./faculty-dict.interface";
import {FacultyDict} from "./faculty-dict.model";
import {DbTransactions} from "../../services/db-transactions.service";
import {DepartmentDict} from "./department-dict.model";


@Controller('dict')
export class DictController {

  constructor(private dictService: DictService,
              private dbTransactions: DbTransactions,
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

  @Get('faculty')
  getFaculty() {
    return this.dictService.getFaculty()
  }

  @Put('faculty')
  @UseGuards(AuthGuard())
  async saveFaculty(@Body() body: IFacultyDict) {
    const oldBody = await FacultyDict.findById(body.id);

    return oldBody
      ? Promise.all([
        oldBody.update(body),
        this.dbTransactions.createOrUpdateRel(DepartmentDict, 'facultyId', body.id, 'departments', body)
      ]).then(() => this.dictService.getOneFaculty(body.id))
        .catch(err => this.errHandler.handlaAll(err))
      : FacultyDict.create(body)
  }

  @Delete('faculty/:id')
  @UseGuards(AuthGuard())
  async deleteFaculty(@Param('id') id: string) {
    return SalaryDict.destroy({where: {id}})
  }


}
