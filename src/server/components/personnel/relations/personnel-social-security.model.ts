import {AutoIncrement, BelongsTo, Column, ForeignKey, PrimaryKey, Table, Unique} from 'sequelize-typescript';
import PersonnelNamedThingWithDoc from './personnel-named-thing-with-doc.model';
import {ISocialSecurity} from "./personnel-social-security.interface";
import IDoc from '../../../interfaces/doc.interface';
import Doc from '../../../interfaces/doc.model';

@Table({
  tableName: 'social-security'
})
export default class SocialSecurity extends PersonnelNamedThingWithDoc implements  ISocialSecurity {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column
  @ForeignKey(() => Doc)
  socialSecurityDocId: number;


  @BelongsTo(() => Doc, 'socialSecurityDocId')
  doc: IDoc;

  @Column reason: string
}
