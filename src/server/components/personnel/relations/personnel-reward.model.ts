import {Model, Table} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';

@Table({
  tableName: 'reward'
})
export default class Reward extends PersonnelNamedThingWithDoc {}
