
import {Injectable} from '@nestjs/common';
import {DbTransactions} from "../../services/db-transactions.service";
import {ErrHandler} from "../../services/error-handler.service";
import SalaryDict from "./salary-dict.model";

@Injectable()
export class DictService {

  constructor(private dbTransactions: DbTransactions, private errHandler: ErrHandler) {}

  getSalary() {
    return SalaryDict.findAll()
  }
}
