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
import LaborContract from "../components/personnel/relations/personnel-labor-contract.interface";


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
  LaborContract,
]);

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
  LaborContract.sync();

//Personnel.upsert({id: 29, name: 'john'});
//QualImprovement.upsert({id: 1, personnelId: 29, reason: 'tak nado'});
//Family.upsert({"id":1,"personnelId":29,"relationshipDegree":"1","fullName":"2","birthYear":2222});

//Institution.upsert({/*"id":1,*/"personnelId":29,"name":"1","docName":"2","docCode":"3","docNumber":"4","qualification":"6","specialty":"7","endDate":5});
//Institution.upsert({/*"id":2,*/"personnelId":29,"name":"лети","docName":"диплом","docCode":"ВН","docNumber":"475679578","qualification":"инженер","specialty":"программист","endDate":2005});
});
