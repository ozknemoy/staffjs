
import {Injectable} from '@nestjs/common';
import {DbTransactions} from "../../services/db-transactions.service";
import {ErrHandler} from "../../services/error-handler.service";

@Injectable()
export class DictService {

  constructor(private dbTransactions: DbTransactions, private errHandler: ErrHandler) {}


}
