import {Sequelize} from 'sequelize-typescript';
import Personnel from "../components/personnel/personnel.model";
import Family from "../components/personnel/relations/personnel-family.model";
import Attestation from "../components/personnel/relations/personnel-attestation.model";
import Passport from "../components/personnel/relations/personnel-passport.model";
import {default as ProfRetraining} from "../components/personnel/relations/personnel-prof-retraining.model";
import QualImprovement from "../components/personnel/relations/personnel-qual-improvement.model";
import Workplace from "../components/personnel/relations/personnel-workplace.model";
import Reward from "../components/personnel/relations/personnel-reward.model";
import SocialSecurity from "../components/personnel/relations/personnel-social-security.model";
import Army from '../components/personnel/relations/personnel-army.model';
import Vacation from '../components/personnel/relations/personnel-vacation.model';
import Institution from "../components/personnel/relations/personnel-institution.model";
import WorkExp from '../components/personnel/relations/personnel-work-exp.model';
import ScientificInst from '../components/personnel/relations/personnel-scientific-inst.model';
import User from "../components/user/user.model";
import LaborContractDocx from "../components/print/labor-contract-docx.model";
import {laborContractDocxDict} from "../../shared/dictionaries/labor-contract-docx.dict";
import AcademicRank from "../components/personnel/relations/academic-rank.model";
import SalaryDict from "../components/dict/salary-dict.model";
import {salaryDict} from "../../shared/dictionaries/salary.dict";
import {IFacultyDict} from "../components/dict/faculty-dict.interface";
import {FacultyDict} from "../components/dict/faculty-dict.model";
import {departmentDict, facultyDict} from "../../shared/dictionaries/faculty.dict";
import {DepartmentDict} from "../components/dict/department-dict.model";
import {FakePersonnel} from '../../shared/faker/fake-personnel';
import {UploadService} from '../components/upload/upload.service';
import {ErrHandler} from '../services/error-handler.service';
import {PersonnelService} from '../components/personnel/personnel.service';
import {DbTransactions} from '../services/db-transactions.service';


export const staffJsDB = new Sequelize({
  database: 'staffjs_millions',
  dialect: 'postgres',
  username: 'postgres',
  password: '1',
  port: 5432,
  define: {
    timestamps: false,
    // prevent sequelize from pluralizing table names
    freezeTableName: true
  },
  operatorsAliases: false,
  // storage: ':memory:',
  //modelPaths: [__dirname + '/../models']
});


staffJsDB.addModels([
  Personnel, Family, Attestation, Passport, ProfRetraining, QualImprovement,
  Reward, SocialSecurity, Workplace, Army, Vacation, Institution, WorkExp, ScientificInst,
  User, LaborContractDocx, AcademicRank, SalaryDict, FacultyDict, DepartmentDict,
]);
/*{force: true}*/

// обязательный порядок
Personnel.sync().then(async () => {
  // не обязательный
  Attestation.sync();
  Passport.sync();
  Family.sync();
  ProfRetraining.sync();
  QualImprovement.sync();
  Reward.sync();
  SocialSecurity.sync();
  Army.sync();
  Vacation.sync();
  Institution.sync();
  await Workplace.sync(/*{alter: true}*/);
  WorkExp.sync();
  ScientificInst.sync();
  /*syncAndFillIfEmptyTable(LaborContractDocx, laborContractDocxDict);
  syncAndFillIfEmptyTable(SalaryDict, salaryDict);
  syncAndFillIfEmptyTable(FacultyDict, facultyDict)
    .then(() => syncAndFillIfEmptyTable(DepartmentDict, departmentDict));*/
  User.sync();
  await AcademicRank.sync();
  /*console.time('1');
  new UploadService(
    new ErrHandler(),
    new PersonnelService(new DbTransactions(), new ErrHandler())).createFakerWorkerscreatedFakesIterations(500)
    .then(()=>console.timeEnd('1'))*/
});
var dbStreamer = require('db-streamer'),
  connString = 'jdbc:postgresql://localhost:5432/postgres';

// create inserter
const inserter = dbStreamer.getInserter({
  dbConnString: connString,
  tableName: 'staffjs_millions',
  useSequelizeBulkInsert: true,
  sequelizeModel: Personnel
});
const workers = FakePersonnel.create(0);
// establish connection
console.time('-------end------');
inserter.connect(function(err, client) {

  // push some rows
  workers.map(worker => inserter.push(worker.worker));
  // create child table inserter using deferring strategy
  // this is useful to avoid missing foreign key conflicts as a result of race conditions
  /*const childInserter = dbStreamer.getInserter({
    dbConnString: connString,
    tableName: 'staffjs_millions',
    useSequelizeBulkInsert: true,
    sequelizeModel: Passport
  });
  console.log(workers[0].worker);

  childInserter.push(workers[0].passport);

  childInserter.setEndHandler((log) => {
    console.log('-------child end------', log);
  });*/

  // set end callback
  inserter.setEndHandler(function(log) {
    console.timeEnd('-------end------');
    //childInserter.end();
  });

  // announce end
  inserter.end();

});
//Personnel.destroy({where: {}});

// хелпер добавления json в таблицу
function syncAndFillIfEmptyTable(model, dict) {
  return model.sync().then(() =>
    model.count().then(n => {
      if (n === 0) {
        return model.bulkCreate(dict)
      }
    })
  );
}
