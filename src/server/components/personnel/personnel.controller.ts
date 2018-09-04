import {Body, Controller, Get, Param, Post, Put, Query} from '@nestjs/common';
import {PersonnelService} from "./personnel.service";
import {IPersonnel} from "./personnel.interface";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import {IFamily} from "./relations/personnel-family.interface";
import QualImprovement from "./relations/personnel-qual-improvement.model";
import Family from "./relations/personnel-family.model";
import Institution from "./relations/personnel-institution.model";
import ProfRetraining from './relations/personnel-prof-retraining.model';
import IProfRetraining from './relations/personnel-prof-retraining.interface';
import IAttestation from './relations/personnel-attestation.interface';
import Attestation from './relations/personnel-attestation.model';


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

  @Get(':id/prof-retrainig')
  getProfRetraining(@Param('id') id) {
    return this.personnelService.getByParent(ProfRetraining, id);
  }

  @Put(':id/prof-retrainig')
  saveOrCreateProfRetraining(@Param('id') id, @Body() body: IProfRetraining[]) {
    return this.personnelService.saveOrCreateProfRetraining(id, body);
  }

  @Get(':id/attestation')
  getAttestation(@Param('id') id) {
    return this.personnelService.getByParent(Attestation, id);
  }

  @Put(':id/attestation')
  saveOrCreateAttestation(@Param('id') id, @Body() body: IAttestation[]) {
    return this.personnelService.saveOrCreateAttestation(id, body);
  }
}
