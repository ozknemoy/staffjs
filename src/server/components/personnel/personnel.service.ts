
import {IPersonnel} from "./personnel.interface";
import {Component} from "@nestjs/common";
import {staffJsDB} from "../../configs/staffjs.database";
import Personnel from "./personnel.model";
import Family from "./personnel-family.model";
import {DbTransactions} from "../../services/db-transactions.service";

@Component()
export class PersonnelService {

  constructor(private dbTransactions: DbTransactions) {}

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
      this.dbTransactions.createOrUpdateRel(Family, 'personnelId', id, 'family', pers)
    ]).then(() => this.getOne(id))
  }


  createOne(pers: Personnel) {

     pers.id = null;
    delete pers.family[0].id;
    return Personnel.create(pers, { include: [ Family ]})
  }

}
