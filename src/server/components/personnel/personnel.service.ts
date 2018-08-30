
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
    return Personnel.findOne({where: {id},  include: [{ all: true }]})
  }

  getOneWithoutInclude(id) {
    return Personnel.findOne({where: {id}})
  }

  async updateOne(id: number, pers: IPersonnel) {
    const oldPersModel = await this.getOneWithoutInclude(id);
    return Promise.all([
      oldPersModel.update(pers),
      this.dbTransactions.createOrUpdateRel(Family, 'personnelId', id, 'families', pers)
    ]).then(() => this.getOne(id))
      .catch(err => this.errHandler.handlaAll(err))
  }


  createOne(pers: Personnel) {

    return Personnel.create(pers, { include: [ Family ]})
  }

  getByParent(_Model, personnelId: number) {
    return _Model.findAll({where: {personnelId}})
  }

  saveOrCreateQualImprovements(personnelId, qualImprovements: IQualImprovement[]) {
    //const oldQualImpModels = await this.getQualImprovementsByParent(personnelId);
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

}
