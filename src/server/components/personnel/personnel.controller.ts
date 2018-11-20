import {Body, Controller, Delete, Get, Param, Post, Put, Query, UseGuards} from '@nestjs/common';
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
import {IPassport} from './relations/personnel-passport.interface';
import Passport from './relations/personnel-passport.model';
import IArmy from './relations/personnel-army.interface';
import Army from './relations/personnel-army.model';
import Workplace from './relations/personnel-workplace.model';
import IWorkplace from './relations/personnel-workplace.interface';
import Reward from './relations/personnel-reward.model';
import {IPersonnelNamedThingWithDoc} from './relations/personnel-named-thing-with-doc.interface';
import {ISocialSecurity} from './relations/personnel-social-security.interface';
import SocialSecurity from './relations/personnel-social-security.model';
import WorkExp from "./relations/personnel-work-exp.model";
import {AuthGuard} from "@nestjs/passport";
import {IServerFilter} from "../../../shared/interfaces/server-filter.interface";


@Controller('personnel')
export class StaffController {

  constructor(private personnelService: PersonnelService) {}

  @Get()
  @UseGuards(AuthGuard())
  getStaff(@Query('inactive') inactive) {
    return this.personnelService.getAllByActivity(!inactive);
  }

  @Get(':id')
  getOne(@Param('id') id, @Query('withRel') withRel) {
    let _Model;
    switch (withRel) {
      /*case 'institution': {
        _Model = Institution;
        break;
      }*/
      case 'work-exp': {
        _Model = WorkExp;
        break;
      }
    }
    return !_Model
      ? this.personnelService.getOne(id)
      : this.personnelService.getOneWithInclude(id, _Model);
  }

  @Post()
  createNewWorker() {
    return this.personnelService.createNewWorker();
  }

  @Delete(':id')
  deleteOne(@Param('id') id) {
    return this.personnelService.deleteOne(id);
  }

  @Put(':id')
  updateOne(@Param('id') id, @Body() pers: IPersonnel, @Query('rel') ModelRel?: string) {
    return this.personnelService.updateOne(id, pers);
  }

  @Get(':id/edu')
  getEdu(@Param('id') id) {
    return this.personnelService.getEdu(id);
  }

  @Put(':id/edu')
  updateEdu(@Param('id') id, @Body() pers: IPersonnel) {
    return this.personnelService.saveEdu(id, pers);
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

  @Get(':id/passport')
  getPassport(@Param('id') personnelId) {
    return this.personnelService.getOneByParent(Passport, personnelId);
  }

  @Put(':id/passport')
  saveOrCreatePassport(@Param('id') id, @Body() body: IPassport) {
    return this.personnelService.saveOrCreatePassport(id, body);
  }

  @Get(':id/army')
  getArmy(@Param('id') personnelId) {
    return this.personnelService.getOneByParent(Army, personnelId);
  }

  @Put(':id/army')
  saveOrCreateArmy(@Param('id') id, @Body() body: IArmy) {
    return this.personnelService.saveOrCreateArmy(id, body);
  }

  @Get(':id/workplace')
  getWorkplace(@Param('id') personnelId, @Query('onlyActive') onlyActive) {
    return onlyActive
      ? this.personnelService.getActiveWorkplaceById(personnelId)
      : this.personnelService.getByParent(Workplace, personnelId);
  }

  @Put(':id/workplace')
  saveOrCreateWorkplace(@Param('id') id, @Body() body: IWorkplace[]) {
    return this.personnelService.saveOrCreateWorkplace(id, body);
  }

  @Get(':id/reward')
  getReward(@Param('id') personnelId) {
    return this.personnelService.getByParent(Reward, personnelId);
  }

  @Put(':id/reward')
  saveOrCreateReward(@Param('id') id, @Body() body: IPersonnelNamedThingWithDoc[]) {
    return this.personnelService.saveOrCreateReward(id, body);
  }

  @Get(':id/social-security')
  getSocialSecurity(@Param('id') personnelId) {
    return this.personnelService.getByParent(SocialSecurity, personnelId);
  }

  @Put(':id/social-security')
  saveOrCreateSocialSecurity(@Param('id') id, @Body() body: ISocialSecurity[]) {
    return this.personnelService.saveOrCreateSocialSecurity(id, body);
  }

  @Put(':id/with-rel/work-exp')
  saveOrCreateWorkExp(@Param('id') id, @Body() pers: IPersonnel) {
    return this.personnelService.saveOrCreateWorkExp(id, pers);
  }

  @Post('filter')
  filter(@Param('id') id, @Body() filter: IServerFilter) {
    return this.personnelService.filter(filter);
  }
}
