import {Table, Column, Model, PrimaryKey, Unique, AutoIncrement, ForeignKey, HasOne, BelongsTo} from 'sequelize-typescript';

import Doc from '../../../interfaces/doc.model';
import IDoc from '../../../interfaces/doc.interface';
import IPersonnelNamedThingWithDoc from './personnel-reward.interface';


export default class PersonnelNamedThingWithDoc extends Model<PersonnelNamedThingWithDoc> implements IPersonnelNamedThingWithDoc {

  @AutoIncrement
  @Unique
  @PrimaryKey
  @Column id: number;

  @Column
  @ForeignKey(() => Personnel)
  personnelId: number;

  @BelongsTo(() => Personnel)
  personnel: IPersonnel;

  @Column
  @ForeignKey(() => Doc)
  docId: number;

  @HasOne(() => Doc)
  doc: IDoc;

  @Column name: string;

}
