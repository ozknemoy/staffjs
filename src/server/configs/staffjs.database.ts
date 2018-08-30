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
  Reward, SocialSecurity, Workplace, Army, /*Vacation*/
]);
// Before you can use your models you have to tell sequelize where they can be found. So either set
// modelPaths in the sequelize config or add the required models later on by calling
// sequelize.addModels([Person]) or sequelize.addModels([__dirname + '/models'])
// prioritiLocal.addModels([User]);
// Create the tables:
/*
User.sync();
*/

// обязательный порядок
Personnel.sync();

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
//Workplace.sync();



