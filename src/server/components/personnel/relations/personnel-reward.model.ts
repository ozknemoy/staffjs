import {Table} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';


@Table({
  tableName: 'staff-reward'
})
export default class Reward extends PersonnelNamedThingWithDoc {}
