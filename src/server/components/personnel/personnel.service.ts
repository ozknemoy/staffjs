
import {IPersonnel} from "./personnel.interface";
import {Injectable} from '@nestjs/common';
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
import WorkExp from './relations/personnel-work-exp.model';
import {workExpTypesDict} from '../../../shared/work-exp-types.dict';
import * as _ from 'lodash/core';
import Institution from './relations/personnel-institution.model';
import ScientificInst from './relations/personnel-scientific-inst.model';
import {HandleData} from '../../../client/app/shared/services/handle-data';
import LaborContract from './relations/personnel-labor-contract.model';
import ILaborContract from './relations/personnel-labor-contract.interface';
import AcademicRank from "./relations/academic-rank.model";

@Injectable()
export class PersonnelService {

  constructor(private dbTransactions: DbTransactions, private errHandler: ErrHandlerService) {}

  getAllFullData() {
    return staffJsDB.query(`SELECT * FROM Staff`).spread((results, metadata) => results);
    /*Personnel.findAll();*/
  }

  getAll() {
    return staffJsDB.query(`SELECT id, number, name, surname, middleName  FROM staff`).spread((results, metadata) => results);
  }

  getOne(id) {
    return Personnel.findOne({where: {id}})
  }

  getOneFull(id) {
    return Personnel.findOne({where: {id},  include: [{ all: true }]})
  }

  getOneWithInclude(id, ..._Model) {
    return Personnel.findOne({
      where: {id},
      include: _Model,
      /*order: [[Personnel, 'id', 'ASC']]*/})
  }

  async updateOneWithRel(id: number, pers: IPersonnel, ModelRel, propName: keyof IPersonnel) {
    const oldPersModel = await this.getOne(id);
    return Promise.all([
      oldPersModel.update(pers),
      this.dbTransactions.createOrUpdateRel(ModelRel, 'personnelId', id, propName, pers)
    ]).then(() => this.getOneWithInclude(id, ModelRel))
      .catch(err => this.errHandler.handlaAll(err))
  }

  async updateOne(id: number, pers: IPersonnel) {
    const oldPersModel = await this.getOne(id);
    return oldPersModel.update(pers)
      .catch(err => this.errHandler.handlaAll(err))
  }

  createOne(pers: Partial<IPersonnel>) {
    return Personnel.create(pers/*, { include: [ Family, Passport ]}*/)
  }

  getByParent(_Model, personnelId: number, order?: any[]) {
    // this.getByParent(WorkExp, personnelId, [['id', 'ASC']])
    // http://docs.sequelizejs.com/manual/tutorial/querying.html#ordering
    const options = {where: {personnelId}};
    if (order) {
      Object.assign(options, {order})
    }
    return _Model.findAll(options)
  }

  getOneByParent(_Model, personnelId: number) {
    return _Model.findOne({where: {personnelId}})
  }

  getEdu(id) {
    return this.getOneWithInclude(id, Institution, ScientificInst, AcademicRank).then((pers: IPersonnel) => {
      if(!_.isEmpty(pers.institutions)) {
        pers.institutions = HandleData.sortArrById(pers.institutions)
      }
      return pers
    });
  }

  saveEdu(personnelId, pers: IPersonnel) {
    return Promise.all([
      this.updateOneWithRel(personnelId, pers, Institution, 'institutions'),
      this.updateOneWithRel(personnelId, pers, AcademicRank, 'academicRank'),
      this.updateOneWithRel(personnelId, pers, ScientificInst, 'scientificInst'),
    ]).then(() => this.getEdu(personnelId))
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

  saveOrCreateWorkExp(personnelId, pers: IPersonnel) {
    return this.updateOneWithRel(personnelId, pers, WorkExp, 'workExp')
      .catch(err => this.errHandler.handlaAll(err))
  }

  async createNewUserFromAdmin() {
    const newWorker = await Personnel.create({name: 'Новый сотрудник'});
    const personnelId = newWorker.id;
    await Promise.all(
      // надо создать 3 стандартные строчки WorkExp
      workExpTypesDict.map(row => WorkExp.create({typeId: row.id, personnelId}))
    );
    return personnelId
  }

  async deleteOne(id: number) {
    // при первом запросе (когда еще нет данных для юзера) надо создать 3 стандартные строчки WorkExp
    return Personnel.destroy({where: {id}});
  }

  saveOrCreateLaborContract(personnelId, contracts: ILaborContract[]) {
    return this.dbTransactions
      .createOrUpdateManyWithoutRels(LaborContract, 'personnelId', personnelId, contracts)
      .then(() => this.getByParent(LaborContract, personnelId))
      .catch(err => this.errHandler.handlaAll(err))
  }
}
