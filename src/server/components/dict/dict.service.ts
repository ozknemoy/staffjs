
import {Injectable} from '@nestjs/common';
import {DbTransactions} from "../../services/db-transactions.service";
import {ErrHandler} from "../../services/error-handler.service";
import SalaryDict from "./salary-dict.model";
import {FacultyDict} from "./faculty-dict.model";
import {DepartmentDict} from "./department-dict.model";

@Injectable()
export class DictService {

  constructor(private dbTransactions: DbTransactions, private errHandler: ErrHandler) {}

  getSalary() {
    return SalaryDict.findAll()
  }

  getFaculty() {
    return FacultyDict.findAll({include: [DepartmentDict], order: [['departments', 'name', 'ASC']]})
  }

  getOneFaculty(id) {
    return FacultyDict.findById(id, {include: [DepartmentDict]})
  }
}
