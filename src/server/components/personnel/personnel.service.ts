
import {IPersonnel} from "./personnel.interface";
import {Component} from "@nestjs/common";
import {staffJsDB} from "../../configs/staffjs.database";
import Personnel from "./personnel.model";
import Family from "./relations/personnel-family.model";
import {DbTransactions} from "../../services/db-transactions.service";
import {ErrHandlerService} from "../../services/error-handler.service";
import QualImprovement from "./relations/personnel-qual-improvement.model";
import IQualImprovement from "./relations/personnel-qual-improvement.interface";
import {IFamily} from "./relations/personnel-family.interface";
import ProfRetraining from './relations/personnel-prof-retraining.model';
import IProfRetraining from './relations/personnel-prof-retraining.interface';
import IAttestation from './relations/personnel-attestation.interface';
import Attestation from './relations/personnel-attestation.model';
import {IPassport} from './relations/personnel-passport.interface';
import Passport from './relations/personnel-passport.model';
import Army from './relations/personnel-army.model';
import IArmy from './relations/personnel-army.interface';
import Workplace from './relations/personnel-workplace.model';
import IWorkplace from './relations/personnel-workplace.interface';
import {IPersonnelNamedThingWithDoc} from './relations/personnel-named-thing-with-doc.interface';
import Reward from './relations/personnel-reward.model';
import {ISocialSecurity} from './relations/personnel-social-security.interface';
import SocialSecurity from './relations/personnel-social-security.model';
import IWorkExp from './relations/personnel-work-exp.interface';
import WorkExp from './relations/personnel-work-exp.model';
import {workExpTypesDict} from '../../../shared/work-exp-types.dict';

@Component()
export class PersonnelService {

  constructor(private dbTransactions: DbTransactions, private errHandler: ErrHandlerService) {}

  getAllFullData() {
    return staffJsDB.query(`SELECT * FROM Staff`).spread((results, metadata) => results);
    /*Personnel.findAll();*/
  }

  getAll() {
    return staffJsDB.query(`SELECT id, number, name  FROM staff`).spread((results, metadata) => results);
  }

  getOne(id) {
    return Personnel.findOne({where: {id}/*,  include: [{ all: true }]*/})
  }

  getOneWithoutInclude(id) {
    return Personnel.findOne({where: {id}})
  }

  async updateOneWithRel(id: number, pers: IPersonnel, ModelRel, propName: keyof IPersonnel) {
    const oldPersModel = await this.getOneWithoutInclude(id);
    return Promise.all([
      oldPersModel.update(pers),
      this.dbTransactions.createOrUpdateRel(ModelRel, 'personnelId', id, propName, pers)
    ]).then(() => this.getOne(id))
      .catch(err => this.errHandler.handlaAll(err))
  }

  async updateOne(id: number, pers: IPersonnel) {
    const oldPersModel = await this.getOneWithoutInclude(id);
    return oldPersModel.update(pers)
      .catch(err => this.errHandler.handlaAll(err))
  }


  createOne(pers: Personnel) {

    return Personnel.create(pers, { include: [ Family ]})
  }

  getByParent(_Model, personnelId: number) {
    return _Model.findAll({where: {personnelId}})
  }

  getOneByParent(_Model, personnelId: number) {
    return _Model.findOne({where: {personnelId}})
  }

  saveOrCreateQualImprovements(personnelId, qualImprovements: IQualImprovement[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(QualImprovement, 'personnelId', personnelId, qualImprovements)
      .then(() => this.getByParent(QualImprovement, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateFamily(personnelId, families: IFamily[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(Family, 'personnelId', personnelId, families)
      .then(() => this.getByParent(Family, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateProfRetraining(personnelId, profRetrainings: IProfRetraining[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(ProfRetraining, 'personnelId', personnelId, profRetrainings)
      .then(() => this.getByParent(ProfRetraining, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateAttestation(personnelId, attestations: IAttestation[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(Attestation, 'personnelId', personnelId, attestations)
      .then(() => this.getByParent(Attestation, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreatePassport(personnelId, passport: IPassport) {
    return Passport.upsert(passport, { returning: true })
      .spread((_passport, created) => _passport)
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateArmy(personnelId, army: IArmy) {
    return Army.upsert(army, { returning: true })
      .spread((_army, created) => _army)
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateWorkplace(personnelId, workplace: IWorkplace[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(Workplace, 'personnelId', personnelId, workplace)
      .then(() => this.getByParent(Workplace, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateReward(personnelId, reward: IPersonnelNamedThingWithDoc[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(Reward, 'personnelId', personnelId, reward)
      .then(() => this.getByParent(Reward, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  saveOrCreateSocialSecurity(personnelId, socialSec: ISocialSecurity[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(SocialSecurity, 'personnelId', personnelId, socialSec)
      .then(() => this.getByParent(SocialSecurity, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }

  async getOrCreateNGetWorkExp(personnelId) {
    // при первом запросе надо создать 3 стандартные строчки
    const workExp = await this.getByParent(WorkExp, personnelId);
    if (workExp) {
      return workExp
    }
    await Promise.all(
      workExpTypesDict.map(row => WorkExp.create({typeId: row.id, personnelId}))
    );
    return this.getByParent(WorkExp, personnelId);
  }

  saveOrCreateWorkExp(personnelId, workExp: IWorkExp[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(WorkExp, 'personnelId', personnelId, workExp)
      .then(() => this.getByParent(WorkExp, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }
}
