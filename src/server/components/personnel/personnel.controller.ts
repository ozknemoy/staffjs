import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {PersonnelService} from "./personnel.service";
import {IPersonnel} from "./personnel.interface";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import {IFamily} from "./relations/personnel-family.interface";
import QualImprovement from "./relations/personnel-qual-improvement.model";
import Family from "./relations/personnel-family.model";
import Institution from "./relations/personnel-institution.model";


@Controller('personnel')
export class StaffController {

  constructor(private personnelService: PersonnelService) {}

  @Get()
  getStaff() {
    return this.personnelService.getAll();
  }

  @Get(':id')
  getOne(@Param('id') id) {
    return this.personnelService.getOne(id);
  }

  @Put(':id')
  updateOne(@Param('id') id, @Body() pers: IPersonnel, @Query('rel') ModelRel?: string) {
    return this.personnelService.updateOne(id, pers);
  }

  @Put(':id/with-rel/institution')
  updateOneInstitution(@Param('id') id, @Body() pers: IPersonnel) {
    return this.personnelService.updateOneWithRel(id, pers, Institution, 'institutions');
  }

  @Get(':id/qual-improvement')
  getQualImprovements(@Param('id') id) {
    return this.personnelService.getByParent(QualImprovement, id);
  }

  @Put(':id/qual-improvement')
  saveOrCreateQualImprovements(@Param('id') id, @Body() body: IQualImprovement[]) {
    return this.personnelService.saveOrCreateQualImprovements(id, body);
  }

  @Get(':id/family')
  getFamily(@Param('id') id) {
    return this.personnelService.getByParent(Family, id);
  }

  @Put(':id/family')
  saveOrCreateFamily(@Param('id') id, @Body() body: IFamily[]) {
    return this.personnelService.saveOrCreateFamily(id, body);
  }
}
