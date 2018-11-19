import {Model, Sequelize} from 'sequelize-typescript';
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


export const staffJsDB = new Sequelize({
  database: 'staffjs',
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
  modelPaths: [__dirname + '/../models']
});


staffJsDB.addModels([
  Personnel, Family, Attestation, Passport, ProfRetraining, QualImprovement,
  Reward, SocialSecurity, Workplace, Army, Vacation, Institution, WorkExp, ScientificInst,
  User, LaborContractDocx, AcademicRank
]);
/*{force: true}*/

// обязательный порядок
Personnel.sync().then(() => {
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
  Workplace.sync();
  WorkExp.sync();
  ScientificInst.sync();
  syncAndFillIfEmptyTable(LaborContractDocx, laborContractDocxDict);
  User.sync();
  AcademicRank.sync();

});
//Personnel.destroy({where: {}});

// хелпер добавления json в таблицу
function syncAndFillIfEmptyTable(model, dict) {
  model.sync().then(() => {
    model.count().then(n => {
      if (n === 0) {model.bulkCreate(dict)}
    })
  });
}
