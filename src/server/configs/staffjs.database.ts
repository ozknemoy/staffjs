import {Sequelize} from 'sequelize-typescript';
import Staff from "../components/personnel/personnel.model";


export const staffJsDB = new Sequelize({
  database: 'staffjs',
  dialect: 'postgres',
  username: 'postgres',
  password: '1',
  port: 5432,
  define: {
    // don't add the timestamp attributes (updatedAt, createdAt)
    timestamps: true,
    // prevent sequelize from pluralizing table names
    freezeTableName: true
  },
  operatorsAliases: false,
  // storage: ':memory:',
  modelPaths: [__dirname + '/../models']
});

staffJsDB.addModels([
  Staff,
]);
// Before you can use your models you have to tell sequelize where they can be found. So either set
// modelPaths in the sequelize config or add the required models later on by calling
// sequelize.addModels([Person]) or sequelize.addModels([__dirname + '/models'])
// prioritiLocal.addModels([User]);
// Create the tables:
/*
User.sync();
*/

Staff.sync();

