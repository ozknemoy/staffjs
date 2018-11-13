import {AutoIncrement, Column, DataType, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';
import {ISocialSecurity} from "./personnel-social-security.interface";

@Table({
  tableName: 'staff-social-security'
})
export default class SocialSecurity extends PersonnelNamedThingWithDoc implements  ISocialSecurity {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column reason: string;
  @Column docNumber: string;
  /*dummy*/ docName: string;
  @Column({type: DataType.DATE}) docDate: string;
}
